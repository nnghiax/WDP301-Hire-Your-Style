const router = require("express").Router();
const middleware = require("../controller/middleware");
const userController = require("../controller/userController");
const { uploadCloud } = require("../controller/imageUpload");

router.get(
  "/count",
  middleware.verifyToken,
  middleware.verifyAdmin,
  userController.countUser
);
router.get(
  "/list",
  middleware.verifyToken,
  middleware.verifyAdmin,
  userController.listUser
);
router.put(
  "/update",
  middleware.verifyToken,
  uploadCloud.single("avatar"),
  userController.updateProfile
);
router.get("/profile", middleware.verifyToken, userController.getProfile);
router.get(
  "/profile/:id",
  middleware.verifyToken,
  middleware.verifyOwner,
  userController.getProfile
);

router.get(
  "/profile/admin/:id",
  middleware.verifyToken,
  middleware.verifyAdmin,
  userController.getProfile
);

module.exports = router;
