const express = require("express");

// Import Controllers and Middleware
const expenseController = require("../controllers/expense");
const userAuthentication = require("../middleware/auth");

const router = express.Router();

// Route to add a new expense
router.post(
  "/add-expense",
  userAuthentication.authenticate, // Middleware for user authentication
  expenseController.postExpense // Controller to handle adding an expense
);

// Route to get all expenses (with pagination if applicable)
router.get(
  "/get-expenses",
  userAuthentication.authenticate, // Middleware for user authentication
  expenseController.getExpenses // Controller to retrieve expenses
);

// Route to download the current user's expense file
router.get(
  "/download",
  userAuthentication.authenticate, // Middleware for user authentication
  expenseController.getdownloadfile // Controller to handle file download
);

// Route to get all downloadable files
router.get(
  "/download-file",
  userAuthentication.authenticate, // Middleware for user authentication
  expenseController.getallfiles // Controller to retrieve all files
);

// Route to delete an expense by ID
router.delete(
  "/delete-expense/:id",
  userAuthentication.authenticate, // Middleware for user authentication
  expenseController.deleteExpense // Controller to handle expense deletion
);

router.put(
  "/update-expense/:id",
  userAuthentication.authenticate, // Middleware for user authentication
  expenseController.updateExpense // Controller to handle updating an expense
);

// Export the router to use in the application
module.exports = router;
