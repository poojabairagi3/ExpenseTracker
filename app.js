require("dotenv").config();
const path = require("path");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const app = express();

// Security, compression, and CORS middleware
app.use(helmet());
app.use(compression());
app.use(cors());

// Log requests to access.log
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));

// Set up view engine
app.set("view engine", "ejs");
app.set("views", "views");

// Parsing incoming requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Route Imports
const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");
const purchaseRoutes = require("./routes/purchase");
const premiumRoutes = require("./routes/premium");
const forgotpasswordRoutes = require("./routes/password");

// Model Imports
const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/order");
const Forgotpassword = require("./models/password");
const FileUploaded = require("./models/fileuploaded");

// Route Handling
app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumRoutes);
app.use("/password", forgotpasswordRoutes);

// Associations
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(FileUploaded);
FileUploaded.belongsTo(User);

// 404 Error Handling
app.use((req, res) => {
  res.status(404).json({ error: "Page not found" });
});

// Global Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Database Sync and Server Initialization
const PORT = process.env.PORT || 3000;

sequelize
  .sync({ force: process.env.RESET_DB === "true" }) // Enable resetting DB conditionally
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error(err));
