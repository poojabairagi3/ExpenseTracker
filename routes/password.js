const express = require("express");
const resetpasswordController = require("../controllers/password");

const router = express.Router();

// Route for resetting the password form (GET request)
router.get("/resetpassword/:id", resetpasswordController.resetpassword);

// Route to update the password (POST request)
router.post(
  "/updatepassword/:resetpasswordid",
  resetpasswordController.updatepassword
);

// Route for forgot password functionality (POST request)
router.post("/forgotpassword", resetpasswordController.forgotpassword);

module.exports = router;
