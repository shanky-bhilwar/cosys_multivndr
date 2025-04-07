const express = require("express");
const { applyCouponController,
    createCouponController,
    getAllCouponsController,
    getCouponByIdController,
    updateCouponController,
    deleteCouponController
} = require("../controllers/couponController");

const router = express.Router();

// 🟢 Apply Coupon Route
router.post("/apply/:userId", applyCouponController);


// 🟢 Create a Coupon
router.post("/create", createCouponController);

// 🟢 Get All Coupons
router.get("/get/all", getAllCouponsController);

// 🟢 Get Single Coupon by ID
router.get("/getone/:couponid", getCouponByIdController);

// 🟢 Update Coupon
router.put("/update/:couponid", updateCouponController);

// 🟢 Delete Coupon
router.delete("/delete/:couponid", deleteCouponController);

module.exports = router;