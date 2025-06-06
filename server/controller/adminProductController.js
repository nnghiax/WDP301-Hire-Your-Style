const Product = require('../model/Product');
const User = require('../model/User');
const nodemailer = require('nodemailer');

exports.toggleProductVisibility = async (req, res) => {
    try {
        const { productId } = req.params;
        const { isAvailable } = req.body;

        if (typeof isAvailable !== 'boolean') {
            return res.status(400).json({ message: 'isAvailable must be a boolean.' });
        }

        const product = await Product.findById(productId).populate('userId', 'email name');

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        product.isAvailable = isAvailable;
        await product.save();

        if (!isAvailable && product.userId?.email) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: product.userId.email,
                subject: 'Thông báo: Sản phẩm của bạn đã bị ẩn',
                text: `Sản phẩm "${product.name}" của bạn đã bị ẩn khỏi gian hàng bởi quản trị viên (${process.env.EMAIL_USER}).`
            };

            await transporter.sendMail(mailOptions);
        }

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.status(200).json({
            message: `Product ${isAvailable ? 'made visible' : 'hidden'} successfully.`,
            product
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
