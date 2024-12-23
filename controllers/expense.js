const sequelize = require("../util/database");
const Expense = require("../models/expense");
const User = require("../models/user");
const S3Service = require("../services/S3services");
const UserServices = require("../services/userservices");
const FileUploaded = require("../models/fileuploaded");

// Get all uploaded files for the logged-in user
exports.getallfiles = async (req, res) => {
  try {
    const urls = await FileUploaded.findAll({ where: { userId: req.user.id } });
    console.log(urls);
    res.status(200).json({ urls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch files" });
  }
};

// Download expenses and upload them to S3
exports.getdownloadfile = async (req, res) => {
  try {
    const expenses = await UserServices.getExpenses(req);
    const stringifiedExpenses = JSON.stringify(expenses);
    const userId = req.user.id;
    const filename = `myexpense${userId}/${new Date().toISOString()}.txt`;
    const fileURL = await S3Service.uploadToS3(stringifiedExpenses, filename);

    console.log(fileURL);
    await FileUploaded.create({ URL: fileURL, userId });

    res.status(200).json({ fileURL, success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to download file" });
  }
};

// Add a new expense
exports.postExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { amount, description, category } = req.body;

    const expense = await Expense.create(
      { amount, description, category, userId: req.user.id },
      { transaction: t }
    );

    const totalExpense = parseInt(req.user.totalExpenses || 0) + parseInt(amount);
    await User.update(
      { totalExpenses: totalExpense },
      { where: { id: req.user.id }, transaction: t }
    );

    await t.commit();
    res.status(200).json({ expense });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ error: "Failed to add expense" });
  }
};

// Get paginated expenses
exports.getExpenses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const offset = (page - 1) * limit;

    const totalExpenses = await Expense.count({ where: { userId: req.user.id } });
    const expenses = await Expense.findAll({
      where: { userId: req.user.id },
      limit,
      offset,
    });

    res.status(200).json({
      expenses,
      currentPage: page,
      hasNextPage: limit * page < totalExpenses,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalExpenses / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const expenseId = req.params.id;

    if (!expenseId || expenseId === "undefined") {
      console.error("Expense ID is missing");
      return res.status(400).json({ error: "Expense ID is missing" });
    }

    const expense = await Expense.findOne({
      where: { id: expenseId, userId: req.user.id },
    });
    if (!expense) {
      return res
        .status(404)
        .json({ error: "Expense does not belong to the user" });
    }

    const totalExpenses =
      parseInt(req.user.totalExpenses || 0) - parseInt(expense.amount);

    await Expense.destroy({ where: { id: expenseId }, transaction: t });
    await User.update(
      { totalExpenses },
      { where: { id: req.user.id }, transaction: t }
    );

    await t.commit();
    res.sendStatus(200);
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ error: "Failed to delete expense" });
  }
};


// Update an expense by ID
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params; // Extract expense ID from URL params
    const { amount, description, category } = req.body; // Extract updated data from request body

    // Validate required fields
    if (!amount || !description || !category) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Find and update the expense
    const expense = await Expense.findByPk(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found." });
    }

    // Update fields
    expense.amount = amount;
    expense.description = description;
    expense.category = category;

    await expense.save();

    res.status(200).json({ message: "Expense updated successfully.", expense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update expense." });
  }
};
