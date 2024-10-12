
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Customer = sequelize.define('customers', {
    customer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false
});

module.exports = Customer;
