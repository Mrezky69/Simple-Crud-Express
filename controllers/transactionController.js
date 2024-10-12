const { Op } = require('sequelize');
const Transaction = require('../models/transactionModel');
const Customer = require('../models/customerModel');
const Food = require('../models/foodModel');

exports.getAllTransactions = async (req, res) => {
    try {
        const { search, page = 1, limit = 10, customer_id, food_id, transaction_date } = req.query;
        let whereClause = {};

        if (customer_id) {
            whereClause.customer_id = customer_id;
        }
        if (food_id) {
            whereClause.food_id = food_id;
        }
        if (transaction_date) {
            whereClause.transaction_date = {
                [Op.eq]: new Date(transaction_date)
            };
        }

        if (search) {
            const searchNumber = parseFloat(search);
            if (!isNaN(searchNumber)) {
                whereClause = {
                    ...whereClause,
                    [Op.or]: [
                        { total_price: { [Op.eq]: searchNumber } },
                        { qty: { [Op.eq]: searchNumber } }
                    ]
                };
            } else {
                whereClause = {
                    ...whereClause,
                    [Op.or]: [
                        { '$Customer.name$': { [Op.like]: `%${search}%` } },
                        { '$Food.food_name$': { [Op.like]: `%${search}%` } }
                    ]
                };
            }
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);

        const { count, rows } = await Transaction.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            include: [
                {
                    model: Customer,
                    attributes: ['name'],
                    required: true,
                    as: 'Customer'
                },
                {
                    model: Food,
                    attributes: ['food_name'],
                    required: true,
                    as: 'Food'
                }
            ]
        });

        res.json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            data: rows
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



exports.createTransaction = async (req, res) => {
    const { customer_id, food_id, qty, total_price, transaction_date } = req.body;
    try {
        const food = await Food.findByPk(food_id);
        if (!food) {
            return res.status(404).json({ message: 'Food not found' });
        }

        if (food.stock < qty) {
            return res.status(400).json({ message: 'Not enough stock' });
        }

        food.stock -= qty;
        await food.save();

        const newTransaction = await Transaction.create({ customer_id, food_id, qty, total_price, transaction_date });
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.updateTransaction = async (req, res) => {
    try {
        const transactionId = req.params.id;
        const { food_id, qty } = req.body;

        const transaction = await Transaction.findByPk(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        const oldFood = await Food.findByPk(transaction.food_id);
        if (!oldFood) {
            return res.status(404).json({ message: 'Old food not found' });
        }

        oldFood.stock += transaction.qty;
        await oldFood.save();

        if (food_id && food_id !== transaction.food_id) {
            const newFood = await Food.findByPk(food_id);
            if (!newFood) {
                return res.status(404).json({ message: 'New food not found' });
            }

            if (newFood.stock < qty) {
                return res.status(400).json({ message: 'Not enough stock for new food' });
            }

            newFood.stock -= qty;
            await newFood.save();
        } else {
            if (oldFood.stock < qty) {
                return res.status(400).json({ message: 'Not enough stock' });
            }

            oldFood.stock -= qty;
            await oldFood.save();
        }

        const [updated] = await Transaction.update(req.body, {
            where: { transaction_id: transactionId }
        });

        if (updated) {
            const updatedTransaction = await Transaction.findOne({ where: { transaction_id: transactionId } });
            res.status(200).json({ transaction: updatedTransaction });
        } else {
            res.status(404).json({ message: 'Transaction not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating transaction' });
    }
};


exports.deleteTransaction = async (req, res) => {
    try {
        const transactionId = req.params.id;

        const transaction = await Transaction.findByPk(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        const food = await Food.findByPk(transaction.food_id);
        if (!food) {
            return res.status(404).json({ message: 'Food not found' });
        }

        food.stock += transaction.qty;
        await food.save();

        const deleted = await Transaction.destroy({
            where: { transaction_id: transactionId }
        });

        if (deleted) {
            res.status(200).json({ message: 'Transaction deleted' });
        } else {
            res.status(404).json({ message: 'Transaction not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting transaction' });
    }
};


