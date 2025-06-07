const express = require('express');
const router = express.Router();
const adminProductController = require('../controller/adminProductController');
const { verifyToken, verifyAdmin } = require('../controller/middleware');

router.patch('/products/:productId/visibility', verifyToken, verifyAdmin, adminProductController.toggleProductVisibility);
router.get('/products/low-rated', verifyToken, verifyAdmin, adminProductController.getLowRatedProducts);
router.get('/products/test', adminProductController.testGetReviews);

module.exports = router;