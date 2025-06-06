const express = require("express");
const multer = require("multer");
const {
  registerUser,
  loginUser,
} = require("../../controllers/auth-controller/index");
const authenticateMiddleware = require("../../middleware/auth-middleware");

const router = express.Router();

// ✅ If you're using 'multipart/form-data' in Postman or HTML form, this is necessary.
router.post("/register", multer().none(), registerUser);

// ✅ Login — assuming JSON body (not multipart/form-data)
router.post("/login", loginUser);

// ✅ Protected route — check current logged-in user
router.get("/check-auth", authenticateMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    data: {
      user: req.user, // populated by auth middleware
    },
  });
});

module.exports = router;
