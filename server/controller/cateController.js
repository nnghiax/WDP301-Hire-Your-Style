const Category = require('../model/Category')
const Product = require('../model/Product')


const cateController = {

    createCategory: async (req, res) => {
        try {
            const name = req.body.name

            if(!name){
                return res.status(400).json({message: 'Name is required'})
            }

            const category = await Category.findOne({name})
            if(category){
                return res.status(400).json({message: 'Category already exist'})
            }

            const newCate = new Category({name})
            await newCate.save()
            return res.status(201).json({message: 'Create category successfully', data: newCate})
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },

    listCategory: async (req, res) => {
        try {
            const list = await Category.find()
            return res.status(200).json({data: list})
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },

    updateCategory: async (req, res) => {
        try {
            const cateId = req.params.cateId
            const name = req.body.name

            const category = await Category.findById(cateId)
            if(!category){
                return res.status(404).json({message: 'Category not found'})
            }

            if(!name){
                return res.status(400).json({message: 'Name is required'})
            }
            
           const checkNameExist = await Category.findOne({ name, _id: { $ne: cateId } });
            if(checkNameExist){
                return res.status(400).json({message: 'Category already exist'})
            }

            const updateCate = await Category.findByIdAndUpdate(
                cateId,
                {name},
                {new: true}
            )
            return res.status(200).json({message: 'Update category successfully', data: updateCate})
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const cateId = req.params.cateId
            
            const category = await Category.findById(cateId)
            if(!category){
                return res.status(404).json({message: 'Category not found'})
            }

            const isUsed = await Product.exists({categoryId: cateId})
            if(isUsed){
                return res.status(400).json({message: 'Cannot delete category in use'})
            }

            await Category.findByIdAndDelete(cateId)
            return res.status(200).json({message: 'Delete category successfully'})
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },
}

module.exports = cateController