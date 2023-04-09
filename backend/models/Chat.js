const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../config/database.js");

// Define the User model
const Chat = sequelize.define("Chat", {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Chat;
