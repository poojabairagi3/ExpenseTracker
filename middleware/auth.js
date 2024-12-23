const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.AUTH_SECRECT); // Corrected typo in "secretkey"

    const user = await User.findByPk(decoded.userId); // Use async/await for cleaner code
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication error:", err.message);
    res.status(401).json({ success: false, message: "Invalid token." });
  }
};

module.exports = {
  authenticate,
};
