const Review = require("../model/Review");
const Rental = require("../model/Rental");
const Product = require("../model/Product");

exports.createReview = async (req, res) => {
  try {
    const { rentalId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!rentalId || !rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Thiếu hoặc không hợp lệ: rentalId hoặc rating" });
    }

    const rental = await Rental.findById(rentalId);
    if (!rental) {
      return res.status(404).json({ message: "Không tìm thấy đơn thuê" });
    }
    if (rental.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền đánh giá đơn thuê này" });
    }
    if (rental.status !== "completed") {
      return res
        .status(400)
        .json({ message: "Chỉ có thể đánh giá đơn thuê đã hoàn thành" });
    }

    const existingReview = await Review.findOne({ rentalId });
    if (existingReview) {
      return res.status(400).json({ message: "Đơn thuê này đã được đánh giá" });
    }

    const review = new Review({
      userId,
      productId: rental.items[0].productId,
      rentalId,
      rating,
      comment: comment || "",
    });

    await review.save();

    res
      .status(201)
      .json({ message: "Đánh giá đã được gửi thành công", data: review });
  } catch (error) {
    console.error("Lỗi khi tạo đánh giá:", error);
    res.status(500).json({ message: "Lỗi server khi tạo đánh giá" });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId })
      .populate("userId", "name")
      .select("rating comment createdAt");

    res.status(200).json({ data: reviews });
  } catch (error) {
    console.error("Lỗi khi lấy đánh giá sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server khi lấy đánh giá sản phẩm" });
  }
};

exports.getStoreReviews = async (req, res) => {
  try {
    const storeId = req.user.storeId;

    const products = await Product.find({ storeId });
    const productIds = products.map((product) => product._id);

    const reviews = await Review.find({ productId: { $in: productIds } })
      .populate("userId", "name")
      .populate("productId", "name")
      .select("rating comment createdAt productId");

    res.status(200).json({ data: reviews });
  } catch (error) {
    console.error("Lỗi khi lấy đánh giá cửa hàng:", error);
    res.status(500).json({ message: "Lỗi server khi lấy đánh giá cửa hàng" });
  }
};
