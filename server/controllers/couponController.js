const productModel = require('../models/productModel');
const userModel = require('../models/userModel');
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");


// this alone controller have logic for all three things 
// 1- applying coupon logic , 2- validating coupon logic , 3 - update cart total
exports.applyCouponController = async (req, res) => {
    try {
        const { code } = req.body;  // 'code' comes from frontend
        const { userId } = req.params;  // Get userId from URL params

        // 🟢 Fetch the user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // 🟢 Calculate total cart price
        let total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

        // 🟢 Validate coupon
        const coupon = await Coupon.findOne({ code, isActive: true });
        if (!coupon) return res.status(400).json({ message: "Invalid or inactive coupon code" });
        if (new Date(coupon.expiryDate) < new Date()) return res.status(400).json({ message: "Coupon has expired" });
        if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ message: "Coupon usage limit exceeded" });
        }

        // 🟢 Calculate discount
        let discount = coupon.discountType === "fixed" 
            ? Math.min(coupon.discountValue, total) 
            : (total * coupon.discountValue) / 100;

        let discountedTotal = total - discount;

        // 🟢 Update cart with discount
        cart.discount = discount;
        cart.total = discountedTotal;
        await cart.save();

        // 🟢 Increase coupon usage count
        await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });

        res.json({
            message: "Coupon applied successfully",
            originalTotal: total,
            discount,
            finalTotal: discountedTotal
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



exports.createCouponController = async (req, res) => {
    try {
        const { code, discountType, discountValue, expiryDate, usageLimit } = req.body;

        // Check if the coupon code already exists
        const existingCoupon = await Coupon.findOne({ code });
        if (existingCoupon) {
            return res.status(400).json({ message: "Coupon code already exists!" });
        }

        // Create a new coupon
        const newCoupon = new Coupon({
            code,
            discountType,
            discountValue,
            expiryDate,
            usageLimit,
            isActive: true, // Default to active
        });

        await newCoupon.save();
        res.status(201).json({ message: "Coupon created successfully", coupon: newCoupon });
    } catch (error) {
        console.error("Error creating coupon:", error);
        res.status(500).json({ message: "Server error" });
    }
};


exports.getAllCouponsController = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json(coupons);
    } catch (error) {
        console.error("Error fetching coupons:", error);
        res.status(500).json({ message: "Server error" });
    }
};


exports.getCouponByIdController = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.couponid);
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        res.json(coupon);
    } catch (error) {
        console.error("Error fetching coupon:", error);
        res.status(500).json({ message: "Server error" });
    }
};


exports.updateCouponController = async (req, res) => {
    try {
        const { code, discountType, discountValue, expiryDate, usageLimit, isActive } = req.body;
        // Use couponid from req.params to match the route definition
        const { couponid } = req.params;

        const updatedCoupon = await Coupon.findByIdAndUpdate(
            couponid,
            { code, discountType, discountValue, expiryDate, usageLimit, isActive },
            { new: true }
        );

        if (!updatedCoupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        res.json({ message: "Coupon updated successfully", coupon: updatedCoupon });
    } catch (error) {
        console.error("Error updating coupon:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



exports.deleteCouponController = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.couponid);
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        res.json({ message: "Coupon deleted successfully" });
    } catch (error) {
        console.error("Error deleting coupon:", error);
        res.status(500).json({ message: "Server error" });
    }
};
