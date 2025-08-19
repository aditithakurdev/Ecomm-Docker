const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Inventory = sequelize.define(
    "Inventory",
    {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        },
    sku: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    warehouseLocation: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM,
        values: Object.values(InventoryStatus),
        defaultValue: InventoryStatus.IN_STOCK,
    }
    },{timestamps: true, freezeTableName: true}
);

module.exports = Inventory;