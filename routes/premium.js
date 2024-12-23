const express = require("express");
const router = express.Router();

const premiumController = require("../controllers/premium");
const premiumAuthentication = require("../middleware/auth");

// Route to get the leaderboard for premium users
router.get(
  "/leaderboard",
  premiumAuthentication.authenticate, // Ensure the user is authenticated before accessing the leaderboard
  premiumController.getPremium // Call the controller function to fetch the leaderboard data
);

module.exports = router;
