
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Customer = require('./customerModel');
const Food = require('./foodModel');

const Transaction = sequelize.define('transactions', {
    transaction_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customer_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Customer,
            key: 'customer_id'
        },
        allowNull: false
    },
    food_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Food,
            key: 'food_id'
        },
        allowNull: false
    },
    qty: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    transaction_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: false
});

Transaction.belongsTo(Customer, { foreignKey: 'customer_id', as: 'Customer' });
Transaction.belongsTo(Food, { foreignKey: 'food_id', as: 'Food' });

module.exports = Transaction;
