const router = require('express').Router()
const authController = require('../controller/authController')
const middlewareController = require('../controller/middleware')

router.post('/register', authController.registerUser)
router.post('/login', authController.loginUser)
router.post('/change-password', middlewareController.verifyToken, authController.changePassword)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)

module.exports = router