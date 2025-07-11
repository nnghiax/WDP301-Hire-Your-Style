const User = require("../model/User");
const nodemailer = require("nodemailer");

const adminUserController = {
  getUsers: async (req, res) => {
    try {
      const admin = req.user;
      if (admin.role !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Access denied. Admin only." });
      }

      const users = await User.find({
        role: { $in: ["customer", "store_owner"] },
      });
      const totalUsers = users.length;
      const customerCount = users.filter((u) => u.role === "customer").length;
      const storeOwnerCount = users.filter(
        (u) => u.role === "store_owner"
      ).length;

      return res.status(200).json({
        success: true,
        message: "Get users successfully",
        data: {
          totalUsers,
          customerCount,
          storeOwnerCount,
          users: users.map((user) => ({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isAvailable: user.isAvailable,
            avatar: user.avatar,
            createdAt: user.createdAt,
          })),
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  updateUserAvailability: async (req, res) => {
    try {
      const admin = req.user;
      if (admin.role !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Access denied. Admin only." });
      }

      const { userId, isAvailable } = req.body;
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      user.isAvailable = isAvailable;
      await user.save();

      // Send email notification if user has an email
      if (user.email) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: isAvailable
            ? "Tài khoản của bạn đã được mở khóa"
            : "Tài khoản của bạn đã bị khóa",
          text: isAvailable
            ? `Chào ${user.name},\n\nTài khoản của bạn đã được mở khóa bởi quản trị viên (${process.env.EMAIL_USER}). Bạn có thể tiếp tục sử dụng dịch vụ.\n\nTrân trọng,\nQuản trị viên Kết Sân`
            : `Chào ${user.name},\n\nTài khoản của bạn đã bị khóa bởi quản trị viên (${process.env.EMAIL_USER}). Vui lòng liên hệ quản trị viên để biết thêm chi tiết.\n\nTrân trọng,\nQuản trị viên Kết Sân`,
        };

        await transporter.sendMail(mailOptions);
      }

      return res.status(200).json({
        success: true,
        message: `User ${isAvailable ? "unlocked" : "locked"} successfully`,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isAvailable: user.isAvailable,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },
};

module.exports = adminUserController;
