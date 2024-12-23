const express = require("express");

const auth = require("../middleware/auth"); // Import the authentication middleware
const userController = require("../controllers/user"); // Import user-related controller

const router = express.Router();

// Route for user registration (sign-up)
router.post("/sign-up", userController.postUser);

// Route for user login
router.post("/login", userController.postLogin);

// Route to check if the user is a premium member, with authentication middleware
router.get("/check-premium", auth.authenticate, userController.checkPremium);

module.exports = router;
