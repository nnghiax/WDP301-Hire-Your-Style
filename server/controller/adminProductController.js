const Product = require('../model/Product');
const User = require('../model/User');
const nodemailer = require('nodemailer');
const Review = require('../model/Review');

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
exports.getLowRatedProducts = async (req, res) => {
  try {
    // Lấy tất cả review có rating <= 2
    const lowRated = await Review.aggregate([
      {
        $match: { rating: { $lte: 2 } }
      },
      {
        $group: {
          _id: "$productId",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 }
        }
      },
      {
        $match: { avgRating: { $lte: 2 } }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      {
        $unwind: "$product"
      },
      {
        $project: {
          _id: "$product._id",
          name: "$product.name",
          price: "$product.price",
          isAvailable: "$product.isAvailable",
          avgRating: 1,
          reviewCount: "$count"
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: "Low-rated products fetched successfully.",
      data: lowRated
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
exports.testGetReviews = async (req, res) => {
  try {
    const reviews = await Review.find().limit(10);
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
