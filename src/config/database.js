const { Sequelize } = require("sequelize");
require("dotenv").config();

// Option 1: Passing a connection URI
// const sequelize = new Sequelize("sqlite::memory:");
// const sequelize = new Sequelize(
//   "postgres://postgres:your_new_password@localhost:5432/ecommerce"
// );

// Option 2: Passing parameters separately (other dialects)
const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    // logging: console.log, // To see SQL queries in console
  }
);
console.log("DIALECT:", process.env.DB_DIALECT);

// Test database connection
db.authenticate()
  .then(() => console.log("PostgreSQL connected."))
  .catch((err) => console.error("Connection error:", err));

// Option 2: Passing parameters separately (sqlite)
// const sequelize = new Sequelize({
//   dialect: "sqlite",
//   storage: "./database.sqlite",
// });
//Testing the connection
// try {
//   await sequelize.authenticate();
//   console.log("Connection has been established successfully.");
// } catch (error) {
//   console.error("Unable to connect to the database:", error);
// }
module.exports = db;