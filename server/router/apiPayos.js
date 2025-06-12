const router = require("express").Router();
const PayOS = require("@payos/node");

const payos = new PayOS(
  "40bf60f0-2231-42c7-98ea-5cd5f8de6afb",
  "b980b35f-d0b5-46bd-a008-e08583ab8c5c",
  "e79cb78fe71a4e76a153b70e8a198189d37bd8ef543f2ccf227cd0cf89e02fb7"
);

router.post("/", async (req, res) => {
  const order = {
    amount: req.body.amount,
    description: req.body.description,
    orderCode: req.body.orderCode,
    returnUrl: req.body.returnUrl,
    cancelUrl: req.body.cancelUrl,
  };

  try {
    const paymentLink = await payos.createPaymentLink(order);
    res.json({ checkoutUrl: paymentLink.checkoutUrl });
  } catch (err) {
    console.error("Lỗi tạo link thanh toán:", err);
    res.status(500).json({ error: "Tạo link thanh toán thất bại" });
  }
});

router.post("/receive-hook", async (req, res) => {
  console.log("Received webhook:", req.body);
  res.sendStatus(200);
});

module.exports = router;
