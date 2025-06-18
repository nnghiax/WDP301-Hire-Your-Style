const express = require("express");
const router = express.Router();
const AdminController = require("../controller/adminUserController");
const { verifyToken, verifyAdmin } = require("../controller/middleware");

router.get("/users", verifyToken, verifyAdmin, AdminController.getUsers);
router.put(
  "/users/availability",
  verifyToken,
  verifyAdmin,
  AdminController.updateUserAvailability
);

module.exports = router;
