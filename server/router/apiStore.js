const router = require("express").Router();
const storeController = require("../controller/storeController");
const middleware = require("../controller/middleware");
const { uploadCloud } = require("../controller/imageUpload");
router.get("/list", middleware.verifyToken, storeController.listStores);
router.get("/listall", middleware.verifyToken, storeController.listAllStores);
router.get("/detail/:storeId", storeController.detailStore);
router.get(
  "/by-user/:userId",
  middleware.verifyToken,
  middleware.verifyOwner,
  storeController.getStoreByUserId
);

router.put(
  "/update/:storeId",
  middleware.verifyToken,
  middleware.verifyOwner,
  uploadCloud.single("image"),
  storeController.updateInforStore
);

module.exports = router;
