const Rental = require("../model/Rental");
const User = require("../model/User");
const nodemailer = require("nodemailer");

exports.getDeposits = async (req, res) => {
  try {
    // Fetch all rentals and populate user data
    const rentals = await Rental.find()
      .populate("userId", "name phone address")
      .lean();

    // Map rentals to the format expected by the frontend
    const deposits = rentals.map((rental) => ({
      _id: rental._id,
      name: rental.userId?.name || "N/A",
      phone: rental.userId?.phone || "N/A",
      address: rental.userId?.address || null,
      depositAmount: rental.depositAmount,
      rentalDate: rental.rentalDate,
      returnDate: rental.returnDate,
      status: rental.status,
      createdAt: rental.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: deposits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi khi tải danh sách đặt cọc",
    });
  }
};

exports.updateRentalStatus = async (req, res) => {
  try {
    const { rentalId } = req.params;
    const { newStatus } = req.body;

    if (newStatus !== "completed") {
      return res.status(400).json({
        success: false,
        message: 'Chỉ được chuyển sang trạng thái "completed"',
      });
    }

    const rental = await Rental.findById(rentalId).populate(
      "userId",
      "email name"
    );

    if (!rental) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn thuê" });
    }

    if (rental.status !== "returned") {
      return res.status(400).json({
        success: false,
        message: `Chỉ được cập nhật đơn có trạng thái "returned". Hiện tại: ${rental.status}`,
      });
    }

    // Cập nhật trạng thái
    await Rental.updateOne(
      { _id: rentalId },
      { $set: { status: "completed" } }
    );

    // ✅ Gửi email thông báo nếu có email người thuê
    if (rental.userId?.email) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: rental.userId.email,
        subject: "Xác nhận hoàn tất đơn thuê",
        text: `Chào ${rental.userId.name},\n\nĐơn thuê của bạn đã được xác nhận hoàn tất. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!\n\nMã đơn: ${rental._id}\n\nTrân trọng,\nHireYourStyle Admin`,
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({
      success: true,
      message: `Đơn thuê ${rentalId} đã được chuyển sang trạng thái completed.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
