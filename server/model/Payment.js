const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    method: {
        type: String,
        enum: ['vnpay', 'cod', 'momo', 'paypal'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    transactionId: String, // từ VNPay/Momo
    note: String
}, { timestamps: true });

module.exports = mongoose.model('payments', paymentSchema);
