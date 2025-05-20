const cloudinary = require('cloudinary').v2
const {CloudinaryStorage} = require('multer-storage-cloudinary')
const multer = require('multer')
require('dotenv').config()


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png'],
    params: {
        folder: 'HireYourStyle'
    }
})

const uploadCloud = multer({storage})

const deleteImage = async (imageUrl) => {
    try {
        if(!imageUrl) return
        const parts = imageUrl.split('/')
        const publicId = `${parts[parts.length - 2]}/${parts[parts.length - 1].split('.')[0]}`
        await cloudinary.uploader.destroy(publicId)
        console.log("Delete successfully", publicId);
    } catch (error) {
        console.error("Delete failed:", error)
    }
}



module.exports = {uploadCloud, deleteImage}