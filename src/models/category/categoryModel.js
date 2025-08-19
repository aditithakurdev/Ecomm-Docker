const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

const Category = sequelize.define(
    "Category",{
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
        type: DataTypes.ENUM,
        values: Object.values(CategoryStatus),
        defaultValue: CategoryStatus.Active,
    }
  }, {timestamps: true, freezeTableName: true}
);

module.exports = Category;




