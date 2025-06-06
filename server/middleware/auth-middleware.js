const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateMiddleware = async (req, res, next) => {
  try {
    // Extract token from header or cookie
    const authHeader = req.headers.authorization;
    let tokenFromCookies = req.cookies.accessToken;

    let token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : tokenFromCookies;

    console.log(token);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Unauthorized.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "JWT_SECRET");

    if (!decoded?._id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Unauthorized.",
      });
    }

    // Optional: attach full user object
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Auth Error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Token verification failed. Please login again.",
    });
  }
};

module.exports = authenticateMiddleware;
