const router = require('express').Router()
const productController = require('../controller/productController')
const middleware = require('../controller/middleware')
const {uploadCloud} = require('../controller/imageUpload')

router.post('/create', middleware.verifyToken, middleware.verifyOwner, uploadCloud.single('image'),  productController.createProduct)

router.get('/list', productController.listProduct)

router.get('/detail/:proId', productController.detailProduct)

router.put('/update/:proId', middleware.verifyToken, middleware.verifyOwner, uploadCloud.single('image'), productController.updateProduct)

router.delete('/delete/:proId', productController.deleteProduct); 

module.exports = router


