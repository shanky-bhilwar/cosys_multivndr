const User = require("../models/userModel");
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
  
      // Set token in HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true, // Prevent access from JavaScript (security)
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      });
  
      // Send user details in response (excluding password)
      res.json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          address:user.address,
          role:user.role,
        },
      });
  
    } catch (error) {
      res.status(500).json({ error: error.message });
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
