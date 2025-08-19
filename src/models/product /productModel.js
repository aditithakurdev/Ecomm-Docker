const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

const Product = sequelize.define(
    "Product",
    {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imageUrl: DataTypes.STRING,
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    category: DataTypes.STRING,
  },
  {}
);

module.exports = Product;
  
