const Order = require("../models/orderModel");

/**
 * Controller to track total revenue.
 * It sums up the totalAmount from all orders that have a completed paymentStatus.
 */
exports.trackRevenueController = async (req, res) => {
  try {
    const revenueAggregation = await Order.aggregate([
      { $match: { paymentStatus: "completed" } }, // Consider only completed orders
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueAggregation.length ? revenueAggregation[0].totalRevenue : 0;
    res.status(200).json({ totalRevenue });
  } catch (error) {
    console.error("Error tracking revenue:", error);
    res.status(500).json({ error: "Failed to track revenue" });
  }
};

/**
 * Controller to track popular products.
 * It unwinds the items array in each order, groups by product _id,
 * sums up the quantities sold, sorts in descending order, and returns the top 5 products.
 */
exports.trackPopularProductsController = async (req, res) => {
    try {
      const popularProducts = await Order.aggregate([
        { $unwind: "$items" },
        { 
          $group: { 
            _id: "$items.product.name", 
            totalQuantity: { 
              $sum: { 
                $ifNull: [ "$items.quantity", "$items.product.quantity" ] 
              } 
            }
          } 
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 5 },
        { $project: { productName: "$_id", totalQuantity: 1, _id: 0 } }
      ]);
      res.status(200).json(popularProducts);
    } catch (error) {
      console.error("Error tracking popular products:", error);
      res.status(500).json({ error: "Failed to track popular products" });
    }
  };

/**
 * Controller to track user activity.
 * It groups orders by userId, counts the number of orders per user,
 * and finds the most recent order date for each user.
 */
exports.trackUserActivityController = async (req, res) => {
  try {
    const userActivity = await Order.aggregate([
      {
        $group: {
          _id: "$userId",
          orderCount: { $sum: 1 },
          lastOrderDate: { $max: "$createdAt" }
        }
      },
      { $sort: { orderCount: -1 } }
    ]);
    res.status(200).json(userActivity);
  } catch (error) {
    console.error("Error tracking user activity:", error);
    res.status(500).json({ error: "Failed to track user activity" });
  }
};
