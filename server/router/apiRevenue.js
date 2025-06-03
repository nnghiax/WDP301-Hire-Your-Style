const express = require('express');
const router = express.Router();
const revenueController = require('../controller/revenueController');
const middlewareController = require('../controller/middleware');


router.use(middlewareController.verifyToken, middlewareController.verifyOwner);

router.get('/total', revenueController.getTotalRevenue); 
router.get('/list', revenueController.getRevenueDetails); 

module.exports = router;