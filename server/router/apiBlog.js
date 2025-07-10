const router = require("express").Router()
const blogController = require("../controller/blogController")
const middleware = require("../controller/middleware")
const { uploadCloud } = require("../controller/imageUpload")

router.post(
    "/create",
    middleware.verifyToken,
    middleware.verifyOwner,
    uploadCloud.single("image"),
    blogController.createBlog
)

router.get(
    "/list",
    middleware.verifyToken,
    blogController.listBlog
)

router.get(
    "/public",
    blogController.listPublicBlog
)

router.get("/detail/:blogId", blogController.detailBlog)

router.put(
    "/update/:blogId",
    middleware.verifyToken,
    middleware.verifyOwner,
    uploadCloud.single("image"),
    blogController.updateBlog
)

router.delete(
    "/delete/:blogId",
    middleware.verifyToken,
    middleware.verifyOwner,
    blogController.deleteBlog
)

module.exports = router