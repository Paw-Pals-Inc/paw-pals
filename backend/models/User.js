const { DataTypes, Op } = require("sequelize");
const sequelize = require("../config/database.js");

// Define the User model
const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  favorites: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
    get() {
      const rawValue = this.getDataValue("favorites");
      return rawValue ? rawValue : null;
    },
    set: function (value) {
      if (typeof value === "string") {
        this.setDataValue("favorites", value);
      } else {
        this.setDataValue("favorites", JSON.stringify(value));
      }
    },
    validate: {
      async isValidIds(value) {
        console.log("value: ", value);
        const arrValue = JSON.parse(value);
        console.log("validating array values");
        if (arrValue == null) {
          // Skip validation if value is null or undefined
          return Promise.resolve();
        }
        if (arrValue && !Array.isArray(arrValue)) {
          throw new Error("userIds must be an array");
        }
        if (
          arrValue &&
          arrValue.some((id) => !Number.isInteger(id) || id < 1)
        ) {
          throw new Error("userIds must contain valid user IDs");
        }
        if (arrValue) {
          const users = await User.findAll({
            where: {
              id: {
                [Op.in]: arrValue,
                [Op.not]: this.id, // Exclude current user's ID
              },
            },
          });

          if (users.length !== arrValue.length) {
            throw new Error("userIds must contain valid user IDs");
          }
        }
      },
    },
  },
});

User.addHook("beforeValidate", (instance) => {
  instance.id = instance.getDataValue("id");
});

module.exports = User;
