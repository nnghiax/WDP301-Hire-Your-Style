const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        storeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "stores",
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    rentalDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    depositAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "payments",
    },
    status: {
      type: String,
      enum: [
        "pending", // Chờ xác nhận
        "confirmed", // Đã xác nhận và đang giao hàng
        "received", // Người thuê đã nhận trang phục
        "returning", // Đang trả lại trang phục
        "returned", // Shop đã nhận lại trang phục
        "completed", // Hoàn tất quy trình
        "cancelled", // Đã hủy
        "reject",
      ],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("rentals", rentalSchema);
