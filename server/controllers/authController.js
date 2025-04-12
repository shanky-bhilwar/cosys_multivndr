const User = require("../models/userModel");
const Vendor = require("../models/vendorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// register controller simply registering user 
exports.registerController = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new user with address
    const user = new User({ name, email, password: hashedPassword, address });
    await user.save();
    
    // Remove password from response for security
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(201).json({ message: "User registered successfully", user: userWithoutPassword });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



// new login controller where we sending the token through the cookie not in response directly
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token (1-day expiration)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Send token directly in response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



  //vendor registration controller and login controller starting from here 
// -------------------- VENDOR --------------------

// Register Vendor
exports.registerVendor = async (req, res) => {
  try {
    const { name, email, password, address, businessName } = req.body;

    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVendor = await Vendor.create({
      name,
      email,
      password: hashedPassword,
      address,
      businessName,
    });

    res.status(201).json({
      success: true,
      message: "Vendor registered successfully",
      vendor: {
        _id: newVendor._id,
        name: newVendor.name,
        email: newVendor.email,
        role: "vendor",
        business_name: newVendor.businessName, 
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Registration failed", error: error.message });
  }
};

// Login Vendor
exports.loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: vendor._id, role: vendor.role },   // ← vendor.role is a Number (1)
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      vendor: {
        _id: vendor._id,
        name: vendor.name,
        email: vendor.email,
        role: "vendor",
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login failed", error: error.message });
  }
};

// // old login controller where we sent the token directly to the response  
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
//     res.json({ token, user });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
