const express = require("express");
const router = express.Router();
const middleware = require("../controller/middleware");
const rentalController = require("../controller/rentalController");

// Create new rental
router.post("/create", middleware.verifyToken, rentalController.createRental);

// Get user's rentals
router.get(
  "/list/by-user",
  middleware.verifyToken,
  rentalController.getUserRentals
);

// Get all rentals (admin)
router.get("/list", middleware.verifyToken, rentalController.getAllRentals);


// Get rental by ID

router.get(
  "/:id",
  middleware.verifyToken,
  middleware.verifyAdmin,
  rentalController.getRentalById
);

// Cancel rental
router.put(
  "/cancel/:id",
  middleware.verifyToken,
  middleware.verifyAdmin,
  rentalController.cancelRental
);

module.exports = router;
