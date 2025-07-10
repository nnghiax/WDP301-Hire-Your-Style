const Blog = require('../model/Blog')
const Store = require('../model/Store')
const { deleteImage } = require('../controller/imageUpload')

const blogController = {
    createBlog: async (req, res) => {
        try {
            const userId = req.userId
            const { storeId, title, content } = req.body

            const store = await Store.findById(storeId)
            if (!store) {
                return res.status(404).json({ message: 'Store not found' })
            }

            if (store.userId.toString() !== userId) {
                return res.status(403).json({ message: 'You are not authorized to create a blog for this store' })
            }

            const image = req.file?.path || '';
            if (!req.file && req.file !== undefined) {
                console.log('File upload error:', req.file);
            }

            const newBlog = new Blog({
                userId,
                storeId,
                title,
                content,
                image
            })

            await newBlog.save()
            return res.status(201).json({ message: 'Blog created successfully', data: newBlog })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    listBlog: async (req, res) => {
        try {
            const userId = req.userId;
            const stores = await Store.find({ userId: userId });
            const storeIds = stores.map(store => store._id);

            const blogs = await Blog.find({ storeId: { $in: storeIds } })
                .populate('storeId', 'name')
                .populate('userId', 'name');
            return res.status(200).json({ data: blogs })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    listPublicBlog: async (req, res) => {
        try {
            const blogs = await Blog.find({ isPublished: true })
                .populate('storeId', 'name')
                .populate('userId', 'name');
            return res.status(200).json({ data: blogs })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    detailBlog: async (req, res) => {
        try {
            const blogId = req.params.blogId
            const blog = await Blog.findOne({ _id: blogId, isPublished: true })
                .populate('storeId', 'name')
                .populate('userId', 'name')
            if (!blog) {
                return res.status(404).json({ message: 'Blog not found or not published' })
            }
            return res.status(200).json({ data: blog })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    updateBlog: async (req, res) => {
        try {
            const blogId = req.params.blogId
            const userId = req.userId
            const { title, content, isPublished } = req.body

            const blog = await Blog.findById(blogId)
            if (!blog) {
                return res.status(404).json({ message: 'Blog not found' })
            }

            if (blog.userId.toString() !== userId) {
                return res.status(403).json({ message: 'You are not authorized to update this blog' })
            }

            const image = req.file?.path || ''
            const updateFields = {}
            if (title !== undefined) updateFields.title = title
            if (content !== undefined) updateFields.content = content
            if (isPublished !== undefined) updateFields.isPublished = isPublished
            if (image) updateFields.image = image

            if (image && blog.image) {
                await deleteImage(blog.image)
            }

            const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateFields, { new: true })
            return res.status(200).json({ message: 'Blog updated successfully', data: updatedBlog })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    deleteBlog: async (req, res) => {
        try {
            const blogId = req.params.blogId
            const userId = req.userId

            const blog = await Blog.findById(blogId)
            if (!blog) {
                return res.status(404).json({ message: 'Blog not found' })
            }

            if (blog.userId.toString() !== userId) {
                return res.status(403).json({ message: 'You are not authorized to delete this blog' })
            }

            if (blog.image) {
                await deleteImage(blog.image)
            }

            await Blog.findByIdAndDelete(blogId)
            return res.status(200).json({ message: 'Blog deleted successfully' })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = blogController