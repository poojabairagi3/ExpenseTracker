const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Expense = sequelize.define(
  "expense",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false,
      
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
      
    },
    category: {
      type: Sequelize.STRING,
      allowNull: false,
      
    },
    // Optional: Automatically include createdAt and updatedAt timestamps
  },
  {
    timestamps: true, // Enable Sequelize's default timestamps for createdAt and updatedAt
  }
);

module.exports = Expense;
