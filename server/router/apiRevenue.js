const express = require('express');
const router = express.Router();
const revenueController = require('../controller/revenueController');
const middlewareController = require('../controller/middleware');


router.use(middlewareController.verifyToken, middlewareController.verifyOwner);

router.get('/total', revenueController.getTotalRevenue); 
router.get('/list', revenueController.getRevenueDetails); 
router.get('/daily', revenueController.getDailyRevenue); 
router.get('/monthly', revenueController.getMonthlyRevenue); 
router.get('/yearly', revenueController.getYearlyRevenue);

module.exports = router;