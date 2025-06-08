const router = require("express").Router();
const cartController = require("../controller/cartController");
const middleware = require("../controller/middleware");

router.post("/add-to-cart", middleware.verifyToken, cartController.addToCart);

router.get("/list", middleware.verifyToken, cartController.listItem);

router.put(
  "/update-quantity/:itemId",
  middleware.verifyToken,
  cartController.updateQuantity
);

router.delete(
  "/delete/:itemId",
  middleware.verifyToken,
  cartController.deleteItem
);

module.exports = router;
