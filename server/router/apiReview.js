const express = require("express");
const router = express.Router();
const reviewController = require("../controller/reviewController");
const middleware = require("../controller/middleware");

router.post("/create", middleware.verifyToken, reviewController.createReview);

router.get(
  "/product/:productId",

  reviewController.getProductReviews
);

router.get("/store", middleware.verifyToken, reviewController.getStoreReviews);

module.exports = router;
