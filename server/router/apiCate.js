const router = require('express').Router()
const middleware = require('../controller/middleware')
const cateController = require('../controller/cateController')


router.post('/create', middleware.verifyToken, middleware.verifyAdmin, cateController.createCategory)

router.get('/list', cateController.listCategory)

router.put('/update/:cateId', middleware.verifyToken, middleware.verifyAdmin, cateController.updateCategory)

router.delete('/delete/:cateId', middleware.verifyToken, middleware.verifyAdmin, cateController.deleteCategory)


module.exports = router