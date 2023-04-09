const sequelize = require("../config/database.js");
const User = require("./User");
const Profile = require("./Profile");
const Chat = require("./Chat");

// Define the associations between the User and Profile models
User.hasOne(Profile, {
  foreignKey: "userID",
});
Profile.belongsTo(User, {
  foreignKey: "userID",
});

// Define the associations between the User and Chat models
User.hasMany(Chat, {
  foreignKey: "senderId",
  as: "sentMessages",
});
User.hasMany(Chat, {
  foreignKey: "receiverId",
  as: "receivedMessages",
});
Chat.belongsTo(User, {
  foreignKey: "senderId",
  as: "sender",
});
Chat.belongsTo(User, {
  foreignKey: "receiverId",
  as: "receiver",
});

module.exports = {
  sequelize,
  User,
  Profile,
  Chat,
};
