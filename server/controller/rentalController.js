const Rental = require("../model/Rental");
const Cart = require("../model/Cart");

const rentalController = {
  // Create new rental
  createRental: async (req, res) => {
    try {
      const {
        items,
        rentalDate,
        returnDate,
        totalAmount,
        depositAmount,
        paymentId,
        cartItemIds,
        storeId,
        status,
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

      // Create rental record
      const rental = new Rental({
        userId: req.user.id,
        storeId,
        items,
        rentalDate: rental_date,
        returnDate: return_date,
        totalAmount,
        depositAmount: depositAmount || Math.round(totalAmount * 0.3),
        paymentId,
        status,
      });

      const savedRental = await rental.save();

      // Remove items from cart if cartItemIds exists
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
  },

  // Get user's rentals
  getUserRentals: async (req, res) => {
    try {
      const { page = 1, limit = 10, status } = req.query;

      const query = { userId: req.user.id };
      if (status) {
        query.status = status;
      }

      const rentals = await Rental.find(query)
        .populate("items.productId", "name image price")
        .populate("items.storeId", "name address")
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
  },

  // Get all rentals (admin)
  getAllRentals: async (req, res) => {
    try {
      const { page = 1, limit = 10, status } = req.query;

      const query = {};
      if (status) {
        query.status = status;
      }

      const rentals = await Rental.find(query)
        .populate("userId", "name email")
        .populate("items.productId", "name image price")
        .populate("items.storeId", "name address")
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
  },

  // Get rental by ID
  getRentalById: async (req, res) => {
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
  },

  // Cancel rental
  cancelRental: async (req, res) => {
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
  },

  // Update rental status (user hoặc admin)
  updateRentalStatus: async (req, res) => {
    try {
      const { id } = req.params; // rentalId
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Trường 'status' là bắt buộc",
        });
      }

      const allowedStatuses = [
        "pending",
        "confirmed",
        "received",
        "returning",
        "returned",
        "completed",
        "cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Trạng thái không hợp lệ",
        });
      }

      const rental = await Rental.findById(id);

      if (!rental) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn thuê",
        });
      }

      rental.status = status;
      await rental.save();

      res.status(200).json({
        success: true,
        message: "Cập nhật trạng thái thành công",
        data: rental,
      });
    } catch (error) {
      console.error("Update rental status error:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật trạng thái đơn thuê",
        error: error.message,
      });
    }
  },
};

module.exports = rentalController;
