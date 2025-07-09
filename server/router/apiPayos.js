const router = require("express").Router();
const PayOS = require("@payos/node");
const middleware = require("../controller/middleware");

const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

router.post("/", middleware.verifyToken, async (req, res) => {
  const { amount, description, orderCode, returnUrl, cancelUrl } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!amount || !description || !orderCode || !returnUrl || !cancelUrl) {
    return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
  }

  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: "Số tiền không hợp lệ" });
  }

  const order = {
    amount: Math.round(amount),
    description,
    orderCode: parseInt(orderCode),
    returnUrl,
    cancelUrl,
  };

  try {
    const paymentLink = await payos.createPaymentLink(order);
    res.json({ checkoutUrl: paymentLink.checkoutUrl });
  } catch (err) {
    console.error("Lỗi tạo link thanh toán:", err);
    res.status(500).json({ error: "Tạo link thanh toán thất bại" });
  }
});

router.post("/receive-hook", middleware.verifyToken, async (req, res) => {
  console.log("Received webhook:", req.body);
  // Xử lý webhook (cập nhật trạng thái đơn hàng, lưu vào DB, v.v.)
  res.sendStatus(200);
});

module.exports = router;
