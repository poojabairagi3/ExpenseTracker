const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Function to generate JWT
function generateAccessToken(id, name) {
  return jwt.sign({ userId: id, name: name }, process.env.AUTH_SECRECT, { expiresIn: "1h" }); // Corrected typo and added token expiration
}

// Controller to handle user registration
exports.postUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is already registered
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      return res.status(409).json({ error: "Email already exists" }); // Used status 409 for conflict
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      name: name,
      email: email,
      password: hashPassword,
    });

    res
      .status(201)
      .json({
        success: true,
        message: "User created successfully",
        userId: newUser.id,
      });
  } catch (err) {
    console.error("Error during user registration:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to check if a user is a premium member
exports.checkPremium = async (req, res) => {
  try {
    const user = req.user;

    if (user) {
      return res.status(200).json({ isPremiumMember: user.isPremiumMember });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("Error checking premium status:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to handle user login
exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = generateAccessToken(user.id, user.name); // Generate JWT
      return res.status(200).json({
        success: true,
        message: "Login successful",
        token: token,
        isPremiumMember: user.isPremiumMember,
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" }); // Used 401 for unauthorized
    }
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
