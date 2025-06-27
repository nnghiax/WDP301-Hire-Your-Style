const express = require("express");
const jwt = require("jsonwebtoken");
const Rental = require("../model/Rental"); // Đường dẫn đến model Rental
const Cart = require("../model/Cart"); // Đường dẫn đến model Cart

const router = express.Router();

// Middleware để verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Tạo rental mới
router.post("/create", authenticateToken, async (req, res) => {
  try {
    const {
      items,
      rentalDate,
      returnDate,
      totalAmount,
      depositAmount,
      paymentId,
      cartItemIds,
      storeId, // Thêm storeId vào body request
    } = req.body;

    // Validate required fields
    if (!items || !rentalDate || !returnDate || !totalAmount || !storeId) {
      return res.status(400).json({
        message:
          "Missing required fields: items, rentalDate, returnDate, totalAmount, storeId",
      });
    }

    // Validate dates
    const rental_date = new Date(rentalDate);
    const return_date = new Date(returnDate);

    if (rental_date >= return_date) {
      return res.status(400).json({
        message: "Return date must be after rental date",
      });
    }

    if (rental_date < new Date()) {
      return res.status(400).json({
        message: "Rental date cannot be in the past",
      });
    }

    // Tạo rental record
    const rental = new Rental({
      userId: req.user.id,
      storeId, // Lưu storeId
      items,
      rentalDate: rental_date,
      returnDate: return_date,
      totalAmount,
      depositAmount: depositAmount || Math.round(totalAmount * 0.3),
      paymentId,
      status: "confirmed",
    });

    const savedRental = await rental.save();

    // Xóa items khỏi cart nếu có cartItemIds
    if (cartItemIds && cartItemIds.length > 0) {
      await Cart.deleteMany({
        _id: { $in: cartItemIds },
        userId: req.user.id,
      });
    }

    res.status(201).json({
      success: true,
      message: "Rental created successfully",
      data: savedRental,
    });
  } catch (error) {
    console.error("Create rental error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create rental",
      error: error.message,
    });
  }
});

// Lấy danh sách rental của user
router.get("/list", authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { userId: req.user.id };
    if (status) {
      query.status = status;
    }

    const rentals = await Rental.find(query)
      .populate("items.productId", "name image price")
      .populate("storeId", "name address") // Populate storeId thay vì items.storeId
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit * 1);

    const total = await Rental.countDocuments(query);

    res.status(200).json({
      success: true,
      data: rentals,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get rentals error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch rentals",
      error: error.message,
    });
  }
});

// Lấy chi tiết rental theo ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const rental = await Rental.findOne({
      _id: req.params.id,
      userId: req.user.id,
    })
      .populate("items.productId", "name image price")
      .populate("storeId", "name address");

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: "Rental not found",
      });
    }

    res.status(200).json({
      success: true,
      data: rental,
    });
  } catch (error) {
    console.error("Get rental error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch rental",
      error: error.message,
    });
  }
});

// Hủy rental (chỉ khi status là pending)
router.put("/cancel/:id", authenticateToken, async (req, res) => {
  try {
    const rental = await Rental.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: "Rental not found",
      });
    }

    if (rental.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending rentals can be cancelled",
      });
    }

    rental.status = "cancelled";
    await rental.save();

    res.status(200).json({
      success: true,
      message: "Rental cancelled successfully",
      data: rental,
    });
  } catch (error) {
    console.error("Cancel rental error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel rental",
      error: error.message,
    });
  }
});

module.exports = router;
