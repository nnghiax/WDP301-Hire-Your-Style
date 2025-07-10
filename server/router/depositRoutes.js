const express = require("express");
const router = express.Router();
const depositController = require("../controller/depositController");
const { verifyToken, verifyAdmin } = require("../controller/middleware");

router.get(
  "/deposits",
  verifyToken,
  verifyAdmin,
  depositController.getDeposits
);
module.exports = router;
