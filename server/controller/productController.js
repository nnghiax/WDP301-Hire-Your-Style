const Product = require('../model/Product')
const Store = require('../model/Store')
const Category = require('../model/Category')
const { deleteImage } = require('../controller/imageUpload')

const productController = {

    createProduct: async (req, res) => {
        try {
            const userId = req.userId
            const { storeId, categoryId, name, description, sizes, quantity, price, color } = req.body

            const store = await Store.findById(storeId)
            if (!store) {
                return res.status(404).json({ message: 'Store not found' })
            }

            const category = await Category.findById(categoryId)
            if (!category) {
                return res.status(404).json({ message: 'Category not found' })
            }

            let sizesArray
            if (sizes !== undefined) {
                try {
                    sizesArray = Array.isArray(sizes) ? sizes : JSON.parse(sizes)

                    const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
                    const invalidSize = sizesArray.find(size => !validSizes.includes(size))
                    if (invalidSize) {
                        return res.status(400).json({ message: `Invalid size: ${invalidSize}` })
                    }
                } catch {
                    return res.status(400).json({ message: 'Invalid sizes format' })
                }
            }

            const image = req.file?.path || ''

            const newProduct = new Product({
                userId,
                storeId,
                categoryId,
                name,
                image,
                description,
                sizes: sizesArray,
                quantity,
                price,
                color
            })
            console.log('Uploaded file:', req.file)


            await newProduct.save()
            return res.status(201).json({ message: 'Product created successfully', data: newProduct })
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },

    listProduct: async (req, res) => {
        try {
            const products = await Product.find()
            return res.status(200).json({ data: products })
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },

    detailProduct: async (req, res) => {
        try {
            const proId = req.params.proId
            const product = await Product.findById(proId)
            if(!product){
                return res.status(404).json({message: 'Product not found'})
            }
            return res.status(200).json({data: product})
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },

    updateProduct: async (req, res) => {
        try {
            const proId = req.params.proId
            const userId = req.userId
            const { categoryId, name, description, sizes, quantity, price, color, isAvailable } = req.body

            const product = await Product.findById(proId)
            if (!product) {
                return res.status(404).json({ message: 'Product not found' })
            }

            if (userId !== product.userId.toString()) {
                return res.status(403).json({ message: 'You are not authorized to update this product' })
            }

            if (categoryId) {
                const category = await Category.findById(categoryId)
                if (!category) {
                    return res.status(404).json({ message: 'Category not found' })
                }
            }

            let sizesArray
            if (sizes !== undefined) {
                try {
                    sizesArray = Array.isArray(sizes) ? sizes : JSON.parse(sizes)

                    const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
                    const invalidSize = sizesArray.find(size => !validSizes.includes(size))
                    if (invalidSize) {
                        return res.status(400).json({ message: `Invalid size: ${invalidSize}` })
                    }
                } catch {
                    return res.status(400).json({ message: 'Invalid sizes format' })
                }
            }



            const image = req.file?.path || ''
            const updateFields = {}
            if (categoryId !== undefined) updateFields.categoryId = categoryId
            if (name !== undefined) updateFields.name = name
            if (description !== undefined) updateFields.description = description
            if (sizes !== undefined) updateFields.sizes = sizesArray
            if (quantity !== undefined) updateFields.quantity = quantity
            if (price !== undefined) updateFields.price = price
            if (color !== undefined) updateFields.color = color
            if (isAvailable !== undefined) updateFields.isAvailable = isAvailable
            if (image) updateFields.image = image

            const updateProduct = await Product.findByIdAndUpdate(proId, updateFields, { new: true })
            return res.status(200).json({ message: 'Update product successfully', data: updateProduct })
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },

 
  deleteProduct: async (req, res) => {
    try {
      const proId = req.params.proId;
      const userId = req.user._id;
      const store = await Store.findOne({ userId, isActive: true });

      if (!store) {
        return res.status(403).json({ success: false, message: "You don't own any store or the store is inactive" });
      }

      const product = await Product.findOne({ _id: proId, storeId: store._id });
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product does not exist or is not in your store' });
      }

      if (product.image) {
        await deleteImage(product.image);
      }

      await Product.findByIdAndDelete(proId);
      return res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

}

module.exports = productController