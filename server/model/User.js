const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    phone: String,
    role: {
        type: String,
        enum: ['customer', 'store_owner', 'admin'],
        default: 'customer'
    },
    address: {
        street: { type: String, default: '' },
        ward: { type: String, default: '' },
        district: { type: String, default: '' },
        city: { type: String, default: '' }
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/dh4vnrtg5/image/upload/v1747473243/avatar_user_orcdde.jpg'
    }
}, { timestamps: true });

module.exports = mongoose.model('users', userSchema);
