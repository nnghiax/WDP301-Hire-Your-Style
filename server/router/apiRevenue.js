const express = require("express");
const router = express.Router();
const revenueController = require("../controller/revenueController");
const {
  verifyToken,
  verifyAdmin,
  verifyOwner,
} = require("../controller/middleware");

router.get(
  "/total",
  verifyToken,
  verifyOwner,
  revenueController.getTotalRevenue
);
router.get(
  "/details",
  verifyToken,
  verifyOwner,
  revenueController.getRevenueDetails
);
router.get(
  "/daily",
  verifyToken,
  [verifyAdmin, verifyOwner],
  revenueController.getDailyRevenue
);
router.get(
  "/monthly",
  verifyToken,
  [verifyAdmin, verifyOwner],
  revenueController.getMonthlyRevenue
);
router.get(
  "/yearly",
  verifyToken,
  [verifyAdmin, verifyOwner],
  revenueController.getYearlyRevenue
);
router.get(
  "/quarterly",
  verifyToken,
  verifyOwner,
  revenueController.getQuarterlyRevenue
);
router.get(
  "/admin/commission",
  verifyToken,
  verifyAdmin,
  revenueController.getAdminMonthlyAndYearlyCommission
);
router.get(
  "/admin/weekly-commission",
  verifyToken,
  verifyAdmin,
  revenueController.getAdminWeeklyCommission
);
router.get(
  "/admin/daily-by-store",
  verifyToken,
  verifyAdmin,
  revenueController.getDailyRevenueByStore
);
router.get(
  "/admin/monthly-by-store",
  verifyToken,
  verifyAdmin,
  revenueController.getMonthlyRevenueByStore
);
router.get(
  "/admin/yearly-by-store",
  verifyToken,
  verifyAdmin,
  revenueController.getYearlyRevenueByStore
);

module.exports = router;
