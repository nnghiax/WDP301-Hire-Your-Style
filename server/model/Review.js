const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    rentalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rentals',
        required: true,
        unique: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        default: ''
    },
}, { timestamps: true })

module.exports = mongoose.model('reviews', reviewSchema)