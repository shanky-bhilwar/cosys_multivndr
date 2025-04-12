require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require('./routes/cartRoutes')
const couponRoutes = require("./routes/couponRoutes");
const orderRoutes = require("./routes/orderRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes")
const disputeRoutes = require('./routes/disputeRoutes');
const userRoutes = require('./routes/userRoutes');

const { verifyToken, verifyAdmin ,verifyvendortoken,verifyVendorrole } = require("./middleware/authMiddleware");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/auth/vendor",authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/inventory",inventoryRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/user', userRoutes);

app.get("/" , async (req,res)=>{

    res.send("hey this message is the confirmation for your running service::")
})


// route to check token middleware working or not 

app.get("/api/protected", verifyToken, (req, res) => {
    res.json({ message: " Verified token You have access!" });
  });

  app.get("/api/protected/admin",verifyAdmin ,(req,res,next) =>{

    res.json({ message : "verified admin role u have access:"})
  })

  app.get("/api/protected/vendor", verifyvendortoken, (req, res) => {
    res.json({ message: " Verified token You have access!" });
  });

  app.get("/api/protected/vendorrole",verifyvendortoken,verifyVendorrole ,(req,res,next) =>{

    res.json({ message : "verified vendor role u have access:"})
  })
  
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    
    console.log(`Server running on port ${PORT}`)
});








// Revenue Tracking:

// We can calculate total revenue by summing up the totalAmount from the Order model (filtering by orders with a paymentStatus of "completed" if needed).

// Popular Products:

// We have an Order model where each order stores an items array that contains product details and quantity. This lets us aggregate and count the number of units sold for each product.

// User Activity:

// The Order model stores the userId for each order, which allows us to track the number of orders per user and the most recent order date.

// The User model is available for additional user details if needed.