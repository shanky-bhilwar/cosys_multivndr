// controllers/vendorController.js
const mongoose = require("mongoose");
const Vendor   = require("../models/vendorModel");
const Product  = require("../models/productModel");
const Order    = require("../models/orderModel");

/**********   ye function har controller me laga hua hai to check vendor role   *******
 * Helper: ensure vendor exists and has role=1
 */
async function ensureVendor(vendorId) {
  const v = await Vendor.findById(vendorId);
  if (!v || v.role !== 1) {
    const err = new Error("Invalid vendor");
    err.status = 403;
    throw err;
  }
  return v;
}

/**
 * GET /vendor/:vendorId/products
 * Returns:
 * {
 *   vendor: { _id, name },
 *   products: [ { name, description, price, category, stock, images, createdAt, updatedAt }, … ]
 * }
 */
exports.getVendorProductsController = async (req, res) => {
    try {
      const { vendorId } = req.params;
  
      // 1. Verify vendor and get its data
      const vendor = await ensureVendor(vendorId);
  
      // 2. Fetch products for this vendor
      const products = await Product.find({ vendor: vendorId })
        .select("name description price category stock images createdAt updatedAt");
  
      // 3. Respond with vendor info + products
      res.status(200).json({
        vendor: { _id: vendor._id, name: vendor.name },
        products
      });
    } catch (error) {
      console.error("Error fetching vendor products:", error);
      res.status(error.status || 500).json({ error: error.message });
    }
  };

/**
 * GET /vendor/:vendorId/sales
 * Sum totalAmount of completed orders for this vendor.
 */
exports.getVendorSalesController = async (req, res) => {
  try {
    const { vendorId } = req.params;
    await ensureVendor(vendorId);

    const agg = await Order.aggregate([
      {
        $match: {
          vendor: new mongoose.Types.ObjectId(vendorId),
          paymentStatus: "completed"
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    const totalRevenue = agg[0]?.totalRevenue || 0;
    const timestamp = new Date();
    res.status(200).json({ totalRevenue, timestamp });
  } catch (error) {
    console.error("Error in sales controller:", error);
    res.status(error.status || 500).json({ error: error.message });
  }
};


/**
 * GET /vendor/:vendorId/orders
 * List all orders containing this vendor’s products,
 * and only include the items belonging to this vendor.
 */

exports.getVendorOrdersController = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const vendorObjectId = new mongoose.Types.ObjectId(vendorId);

    // Verify vendor
    const vendor = await Vendor.findById(vendorObjectId).select("name role");
    if (!vendor || vendor.role !== 1) {
      return res.status(403).json({ error: "Invalid vendor" });
    }

    // Fetch orders matching vendor, regardless of paymentStatus
    const orders = await Order.aggregate([
      { 
        $match: { 
          vendor: vendorObjectId 
        } 
      },
      {
        $project: {
          userId:        1,
          paymentStatus: 1,
          address:       1,
          totalAmount:   1,
          createdAt:     1,
          items: {
            $filter: {
              input: "$items",
              as: "item",
              cond: { $eq: ["$$item.product.vendor", vendorObjectId] }
            }
          }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    res.status(200).json({
      vendor: { _id: vendor._id, name: vendor.name },
      orders   // array of all orders for this vendor
    });
  } catch (error) {
    console.error("Error fetching vendor orders:", error);
    res.status(error.status || 500).json({ error: error.message });
  }
};






/**
 * GET /api/vendor/:vendorId/orders
 * Returns all orders (completed & pending) for this vendor,
 * including only the items that belong to them.
 */

  exports.getVendorStatsController = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const vendorObjectId = new mongoose.Types.ObjectId(vendorId);

    const vendor = await Vendor.findById(vendorObjectId).select("name role");
    if (!vendor || vendor.role !== 1) {
      return res.status(403).json({ error: "Invalid vendor" });
    }

    const productCount = await Product.countDocuments({ vendor: vendorObjectId });

    const ordersAgg = await Order.aggregate([
      { $unwind: "$items" },
      {
        $match: {
          "items.product.vendor": vendorObjectId,
          paymentStatus: "completed"
        }
      },
      { $group: { _id: "$orderId" } },
      { $count: "orderCount" }
    ]);
    const orderCount = ordersAgg[0]?.orderCount || 0;

    const revenueAgg = await Order.aggregate([
      { $unwind: "$items" },
      {
        $match: {
          "items.product.vendor": vendorObjectId,
          paymentStatus: "completed"
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $multiply: ["$items.quantity", "$items.product.price"]
            }
          }
        }
      }
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    res.status(200).json({
      vendor: {
        _id: vendor._id,
        name: vendor.name
      },
      productCount,
      orderCount,
      totalRevenue
    });
  } catch (error) {
    console.error("Error fetching vendor stats:", error);
    res.status(error.status || 500).json({ error: error.message });
  }
};



// new controller that we are made for the commission management for admin and vendor


// GET /api/vendor/:vendorId/commission
exports.getadmincommissioncontroller = async (req, res) => {
  try {
    const { vendorId } = req.params;

    // Get all completed orders of this vendor
    const orders = await Order.find({ vendor: vendorId, paymentStatus: "completed" });

    let totalRevenue = 0;
    let totalCommission = 0;
    const commissionRate = 0.1; // 10% commission

    orders.forEach((order) => {
      totalRevenue += order.totalAmount;
      totalCommission += order.totalAmount * commissionRate;
    });

    const netRevenue = totalRevenue - totalCommission;

    res.json({
      totalRevenue,
      adminCommission: totalCommission,
      netRevenue
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};