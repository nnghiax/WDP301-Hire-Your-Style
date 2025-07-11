const express = require("express");
const router = express.Router();
const depositController = require("../controller/depositController");
const middleware = require("../controller/middleware");

router.get(
  "/deposits",
  middleware.verifyToken,
  middleware.verifyAdmin,
  depositController.getDeposits
);

router.patch(
  "/deposits/:rentalId/status",
  middleware.verifyToken,
  middleware.verifyAdmin,
  depositController.updateRentalStatus
);

module.exports = router;
