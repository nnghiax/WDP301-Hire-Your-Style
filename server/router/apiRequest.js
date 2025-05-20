const router = require('express').Router()
const storeRequestController = require('../controller/requestController')
const middleware = require('../controller/middleware')


router.post('/create', middleware.verifyToken, storeRequestController.createStoreRequest)

router.get('/list', middleware.verifyToken, middleware.verifyAdmin, storeRequestController.listStoreRequest)

router.put('/approve/:requestId', middleware.verifyToken, middleware.verifyAdmin, storeRequestController.approveStoreRequest)

router.put('/reject/:requestId', middleware.verifyToken, middleware.verifyAdmin, storeRequestController.rejectStoreRequest)


module.exports = router