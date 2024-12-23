const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [2, 100], // Name length should be between 2 and 100 characters
    },
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Ensure the email is valid
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [6, 255], // Password should be at least 6 characters long
    },
  },
  isPremiumMember: {
    type: Sequelize.BOOLEAN,
    defaultValue: false, // Set default to false
  },
  totalExpenses: {
    type: Sequelize.INTEGER,
    defaultValue: 0, // Set default total expenses to 0
  },
});

// Ensure we set default `isPremiumMember` to false if not provided
User.beforeCreate((user, options) => {
  if (user.isPremiumMember === undefined) {
    user.isPremiumMember = false; // Set default to false
  }
});

module.exports = User;
