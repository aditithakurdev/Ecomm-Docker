const sequelize = require("sequelize");

sequelize.sync();

module.exports = {
  sequelize,
  User,
};
