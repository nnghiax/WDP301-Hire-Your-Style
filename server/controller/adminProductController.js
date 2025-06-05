const Product = require('../model/Product');

exports.toggleProductVisibility = async (req, res) => {
    try {
        const { productId } = req.params;
        const { isAvailable } = req.body;

        if (typeof isAvailable !== 'boolean') {
            return res.status(400).json({ message: 'isAvailable must be a boolean.' });
        }

        const product = await Product.findByIdAndUpdate(
            productId,
            { isAvailable },
            { new: true }
        );

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
