// const User = require("../../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const registerUser = async (req, res) => {
//   const { userName, userEmail, password, role } = req.body;
//   console.log(userName, userEmail, password, role);
//   const existingUser = await User.findOne({
//     $or: [{ userEmail }, { userName }],
//   });

//   if (existingUser) {
//     return res.status(400).json({
//       success: false,
//       message: "User name or user email already exists",
//     });
//   }

//   const hashPassword = await bcrypt.hash(password, 10);
//   console.log(hashPassword);
//   const newUser = new User({
//     userName,
//     userEmail,
//     role,
//     password: hashPassword,
//   });
//   console.log(newUser);
//   await newUser.save();

//   return res.status(201).json({
//     success: true,
//     message: "User registered successfully!",
//   });
// };

// const loginUser = async (req, res) => {
//   const { userEmail, password } = req.body;

//   const checkUser = await User.findOne({ userEmail });

//   if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid credentials",
//     });
//   }

//   const accessToken = jwt.sign(
//     {
//       _id: checkUser._id,
//       userName: checkUser.userName,
//       userEmail: checkUser.userEmail,
//       role: checkUser.role,
//     },
//     process.env.JWT_SECRET || "JWT_SECRET", // Use environment variable
//     { expiresIn: "120m" }
//   );

//   // ✅ Set the cookie
//   res
//     .cookie("accessToken", accessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production", // use https in production
//       sameSite: "Lax", // or "None" if cross-site
//       maxAge: 1000 * 60 * 120, // 120 minutes
//     })
//     .status(200)
//     .json({
//       success: true,
//       message: "Logged in successfully",
//       data: {
//         user: {
//           _id: checkUser._id,
//           userName: checkUser.userName,
//           userEmail: checkUser.userEmail,
//           role: checkUser.role,
//         },
//       },
//     });
// };


// module.exports = { registerUser, loginUser };
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
const registerUser = async (req, res) => {
  const { userName, userEmail, password, role } = req.body;

  const existingUser = await User.findOne({
    $or: [{ userEmail }, { userName }],
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User name or email already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    userName,
    userEmail,
    password: hashPassword,
    role,
  });

  await newUser.save();

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
  });
};

// LOGIN
const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;

  const checkUser = await User.findOne({ userEmail });
  const isMatch = checkUser && (await bcrypt.compare(password, checkUser.password));

  if (!checkUser || !isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const accessToken = jwt.sign(
    {
      _id: checkUser._id,
      userName: checkUser.userName,
      userEmail: checkUser.userEmail,
      role: checkUser.role,
    },
    process.env.JWT_SECRET || "JWT_SECRET",
    { expiresIn: "120m" }
  );

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax", // use 'None' + secure if cross-origin
      maxAge: 1000 * 60 * 120, // 2 hours
    })
    .status(200)
    .json({
      success: true,
      message: "Logged in successfully",
      data: {
        user: {
          _id: checkUser._id,
          userName: checkUser.userName,
          userEmail: checkUser.userEmail,
          role: checkUser.role,
        },
      },
    });
};

// CHECK AUTH
const checkAuth = async (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ authenticate: false, user: null });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "JWT_SECRET");

    return res.status(200).json({
      authenticate: true,
      user: {
        _id: decoded._id,
        userName: decoded.userName,
        userEmail: decoded.userEmail,
        role: decoded.role,
      },
    });
  } catch (err) {
    return res.status(401).json({ authenticate: false, user: null });
  }
};

// LOGOUT
const logoutUser = async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "Lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    //secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

module.exports = {
  registerUser,
  loginUser,
  checkAuth,
  logoutUser,
};
