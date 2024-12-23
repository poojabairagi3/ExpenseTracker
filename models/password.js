const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Forgotpassword = sequelize.define("Forgotpassword", {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4, // Automatically generate UUID if not provided
  },
  active: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true, // Default value for active
  },
  expiresby: {
    type: Sequelize.DATE,
    allowNull: false, // Ensure expiry date is always provided
  },
  // Foreign key for User
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "Users", // Name of the table (ensure it matches the User model's table name)
      key: "id", // Key in the User model that this field refers to
    },
    onDelete: "CASCADE", // Delete associated records if the user is deleted
  },
});

module.exports = Forgotpassword;
