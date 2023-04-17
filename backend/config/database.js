const { Sequelize } = require("sequelize");
require("dotenv").config();
const sequelize = new Sequelize(
  process.env.MYSQL_DB,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASS,
  {
    host:
      process.env.NODE_ENV === "development"
        ? process.env.MYSQL_HOST
        : process.env.MYSQL_HOST_PROD,
    dialect: "mysql",
    dialectOptions: {
      timezone: "-04:00",
      connectTimeout: 60000,
    },
    // following line for use with cloud sql proxy to use cloud sql db
    // port: process.env.NODE_ENV === "development" ? 3307 : 3306,
  }
);

module.exports = sequelize;
