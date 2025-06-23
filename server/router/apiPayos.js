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
  try {
    const { orderCode, status } = req.body;

    if (status === "PAID") {
      // Tìm thông tin đơn hàng tạm
      const order = await OrderTemp.findOne({ orderCode });
      if (!order)
        return res.status(404).json({ message: "Không tìm thấy order tạm" });

      // Tạo bản ghi rental
      const rental = new Rental({
        userId: order.userId,
        storeId: order.storeId,
        items: order.items,
        rentalDate: order.rentalDate,
        returnDate: order.returnDate,
        totalAmount: order.totalAmount,
        depositAmount: order.depositAmount,
        status: "confirmed",
      });

      await rental.save();

      // Xóa đơn tạm (nếu muốn)
      await OrderTemp.deleteOne({ orderCode });

      console.log("Rental đã được tạo sau thanh toán thành công:", rental);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Lỗi khi xử lý webhook PayOS:", err);
    res.sendStatus(500);
  }
});

module.exports = router;
