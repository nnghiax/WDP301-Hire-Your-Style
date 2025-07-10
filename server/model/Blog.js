const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stores',
        required: true
    },
    title: {
        type: String,
        trim: true,
        required: true
    },
    content: {
        type: String,
        trim: true,
        required: true
    },
    image: String,
    isPublished: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

module.exports = mongoose.model('blogs', blogSchema)