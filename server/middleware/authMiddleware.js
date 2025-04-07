const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

// middleware for verifying token coming from "cookie" not response

const verifyToken = async (req, res, next) => {
    const token = req.cookies.token; // Get token from cookies

    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); //verifying token

        req.user = await User.findById(decoded.id).select("-password"); //we extracted id in decode in previous that we gave during token making in jwt.sign
        //now we finding the user by that id and assigning to "req.user"
        

        if (!req.user) return res.status(401).json({ message: "User not found" });

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

const verifyAdmin = (req, res, next) => {

    //in token middleware we found user by decode.id and assigned it to req.user now we have user we can find the role of the user by this 

    if (!req.user || req.user.role !== 1) {  // Check if role is 1 (admin)
        return res.status(403).json({ message: "Admins only" });
    }
    next();
};

module.exports = { verifyToken, verifyAdmin };



// middleware that we made if we sending the token in response and will receive it through autherization header 

// const verifyToken = async (req, res, next) => {
//     const token = req.header("Authorization");

//     if (!token) return res.status(401).json({ message: "No token provided" });

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = await User.findById(decoded.id).select("-password");
//         if (!req.user) return res.status(401).json({ message: "User not found" });

//         next();
//     } catch {
//         res.status(401).json({ message: "Invalid or expired token" });
//     }
// };

// const verifyAdmin = (req, res, next) => {
//     if (!req.user || req.user.role !== "admin") {
//         return res.status(403).json({ message: "Admins only" });
//     }
//     next();
// };

// module.exports = { verifyToken, verifyAdmin };
