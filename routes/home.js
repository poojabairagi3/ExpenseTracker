const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");
const auth = require("../middleware/auth");

// Route to serve the home page and check if the user is authenticated
router.get("/", homeController.getHomePage);

// Route to fetch user data (e.g., user name)
router.get("/user", auth.authenticate, homeController.getUserData);

module.exports = router;
