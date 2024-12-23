const express = require("express");

const purchaseController = require("../controllers/purchase");
const purchaseAuthentication = require("../middleware/auth");

const router = express.Router();

// Route to initiate premium membership purchase (protected route)
router.get(
  "/premiummember",
  purchaseAuthentication.authenticate,
  purchaseController.purchasePremium
);

// Route to update the transaction status after payment (protected route)
router.post(
  "/updatemembership",
  purchaseAuthentication.authenticate,
  purchaseController.updateTransactionStatus
);

module.exports = router;
