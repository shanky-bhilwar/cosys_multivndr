const express = require("express");
const router = express.Router();
const {
  trackRevenueController,
  trackPopularProductsController,
  trackUserActivityController
} = require("../controllers/analyticsController");

// Route to track revenue
router.get("/track/revenue", trackRevenueController);

// Route to track popular products
router.get("/track/popular-products", trackPopularProductsController);

// Route to track user activity
router.get("/track/user-activity", trackUserActivityController);

module.exports = router;
