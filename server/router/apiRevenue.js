const express = require('express');
const router = express.Router();
const revenueController = require('../controller/revenueController');
const { verifyToken, verifyAdmin, verifyOwner } = require('../controller/middleware');

router.get('/total', revenueController.getTotalRevenue); 
router.get('/details', revenueController.getRevenueDetails); 
router.get('/daily', revenueController.getDailyRevenue); 
router.get('/monthly', revenueController.getMonthlyRevenue); 
router.get('/yearly', revenueController.getYearlyRevenue);
router.get('/admin/commission', verifyToken, verifyAdmin, revenueController.getAdminMonthlyAndYearlyCommission);


module.exports = router;