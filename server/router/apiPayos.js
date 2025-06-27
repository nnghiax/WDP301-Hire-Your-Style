const express = require("express");
const PayOS = require("@payos/node");
const jwt = require("jsonwebtoken");
const Rental = require("../model/Rental"); // Đường dẫn đến model Rental
const Cart = require("../model/Cart"); // Đường dẫn đến model Cart

const router = express.Router();
const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

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

// Route tạo payment link
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { amount, description, orderCode, returnUrl, cancelUrl, rentalData } =
      req.body;

    // Validate required fields
    if (!amount || !orderCode || !returnUrl || !cancelUrl) {
      return res.status(400).json({
        message:
          "Missing required fields: amount, orderCode, returnUrl, cancelUrl",
      });
    }

    // Tạo payment link với PayOS
    const paymentData = {
      orderCode: orderCode,
      amount: amount,
      description: description || "Payment for Hire Your Style",
      returnUrl: returnUrl,
      cancelUrl: cancelUrl,
    };

    const paymentLinkResponse = await payos.createPaymentLink(paymentData);

    // Lưu thông tin tạm thời để xử lý sau khi payment success
    // Bạn có thể lưu vào Redis hoặc database tạm thời
    if (rentalData) {
      // Tạm thời lưu trong memory hoặc cache với orderCode làm key
      global.pendingRentals = global.pendingRentals || {};
      global.pendingRentals[orderCode] = {
        ...rentalData,
        userId: req.user.id,
        orderCode: orderCode,
        amount: amount,
        createdAt: new Date(),
      };
    }

    res.json({
      success: true,
      checkoutUrl: paymentLinkResponse.checkoutUrl,
      orderCode: orderCode,
      paymentId: paymentLinkResponse.paymentLinkId,
    });
  } catch (error) {
    console.error("PayOS Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment link",
      error: error.message,
    });
  }
});

// Route verify payment và tạo rental
router.post("/verify-payment", authenticateToken, async (req, res) => {
  try {
    const { orderCode } = req.body;

    if (!orderCode) {
      return res.status(400).json({ message: "Order code is required" });
    }

    // Verify payment với PayOS
    const paymentInfo = await payos.getPaymentLinkInformation(orderCode);

    if (paymentInfo.status === "PAID") {
      // Lấy thông tin rental từ pending
      const pendingRental = global.pendingRentals?.[orderCode];

      if (pendingRental) {
        // Tạo rental record
        const rental = new Rental({
          userId: pendingRental.userId,
          items: pendingRental.items,
          rentalDate: pendingRental.rentalDate,
          returnDate: pendingRental.returnDate,
          totalAmount: pendingRental.totalAmount,
          depositAmount: pendingRental.depositAmount,
          paymentId: paymentInfo.id,
          status: "confirmed",
        });

        await rental.save();

        // Xóa items khỏi cart
        if (pendingRental.cartItemIds && pendingRental.cartItemIds.length > 0) {
          await Cart.deleteMany({
            _id: { $in: pendingRental.cartItemIds },
            userId: pendingRental.userId,
          });
        }

        // Xóa khỏi pending
        delete global.pendingRentals[orderCode];

        res.json({
          success: true,
          message: "Payment verified and rental created successfully",
          rental: rental,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Rental data not found for this order",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Payment not completed",
        status: paymentInfo.status,
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error: error.message,
    });
  }
});

// Webhook để nhận thông báo từ PayOS (optional)
router.post("/webhook", async (req, res) => {
  try {
    const webhookData = req.body;

    // Verify webhook signature (nếu PayOS hỗ trợ)
    // const isValidSignature = payos.verifyWebhookSignature(webhookData, req.headers);

    if (webhookData.data?.orderCode && webhookData.desc === "success") {
      const orderCode = webhookData.data.orderCode;
      const pendingRental = global.pendingRentals?.[orderCode];

      if (pendingRental) {
        try {
          // Tạo rental record
          const rental = new Rental({
            userId: pendingRental.userId,
            items: pendingRental.items,
            rentalDate: pendingRental.rentalDate,
            returnDate: pendingRental.returnDate,
            totalAmount: pendingRental.totalAmount,
            depositAmount: pendingRental.depositAmount,
            paymentId: webhookData.data.id,
            status: "confirmed",
          });

          await rental.save();

          // Xóa items khỏi cart
          if (
            pendingRental.cartItemIds &&
            pendingRental.cartItemIds.length > 0
          ) {
            await Cart.deleteMany({
              _id: { $in: pendingRental.cartItemIds },
              userId: pendingRental.userId,
            });
          }

          // Xóa khỏi pending
          delete global.pendingRentals[orderCode];

          console.log(`Rental created successfully for order ${orderCode}`);
        } catch (error) {
          console.error(
            `Failed to create rental for order ${orderCode}:`,
            error
          );
        }
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ success: false });
  }
});

// Route kiểm tra trạng thái payment
router.get("/status/:orderCode", authenticateToken, async (req, res) => {
  try {
    const { orderCode } = req.params;

    const paymentInfo = await payos.getPaymentLinkInformation(orderCode);

    res.json({
      success: true,
      status: paymentInfo.status,
      data: paymentInfo,
    });
  } catch (error) {
    console.error("Get payment status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get payment status",
      error: error.message,
    });
  }
});

module.exports = router;
