const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const FileUploaded = sequelize.define("fileuploads", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  URL: {
    type: Sequelize.STRING,
    allowNull: false, // URL must not be null
    validate: {
      isUrl: true, // Ensure the value is a valid URL
    },
  },
  // Assuming the file is associated with a user, we define a UserId foreign key
  userId: {
    type: Sequelize.INTEGER,
  },
});

// Optional: Add a hook to manage any extra logic if required
FileUploaded.beforeCreate((file) => {
  if (!file.URL) {
    throw new Error("File URL is required");
  }
});

module.exports = FileUploaded;
