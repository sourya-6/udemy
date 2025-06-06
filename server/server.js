require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser"); // ✅ Required for reading cookies

// Routes
const authRoutes = require("./routes/auth-routes/index");
const mediaRoutes = require("./routes/instructor-routes/media-routes");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
const studentViewCourseRoutes = require("./routes/student-routes/course-routes");
const studentViewOrderRoutes = require("./routes/student-routes/order-routes");
const studentCoursesRoutes = require("./routes/student-routes/student-courses-routes");
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ✅ Middleware to parse cookies
app.use(cookieParser());

// ✅ CORS setup to allow cookies
app.use(
  cors({
    origin: ["http://localhost:5173", "https://www.paypal.com", "https://www.sandbox.paypal.com"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true, // ✅ allow cookies
  })
);

// ✅ Parses incoming JSON payloads
app.use(express.json());

// ✅ DB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB is connected"))
  .catch((e) => console.log("❌ MongoDB connection error:", e));

// ✅ Route Mounts
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", studentViewCourseRoutes);
app.use("/student/order", studentViewOrderRoutes);
app.use("/student/courses-bought", studentCoursesRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
