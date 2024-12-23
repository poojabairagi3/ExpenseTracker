const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Payment = sequelize.define("Payment", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "PENDING", // Possible values: PENDING, SUCCESSFUL, FAILED
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Payment;
