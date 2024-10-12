const { Op } = require('sequelize');
const Customer = require('../models/customerModel');

exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.json({
            message: "success",
            data: customers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllCustomers = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        let whereClause = {};

        if (search) {
            whereClause = {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { phone: { [Op.like]: `%${search}%` } },
                    { address: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await Customer.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset)
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

exports.createCustomer = async (req, res) => {
    const { name, phone, address } = req.body;
    try {
        const newCustomer = await Customer.create({ name, phone, address });
        res.status(201).json(newCustomer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const customerId = req.params.id;
        const [updated] = await Customer.update(req.body, {
            where: { customer_id: customerId }
        });

        if (updated) {
            const updatedCustomer = await Customer.findOne({ where: { customer_id: customerId } });
            res.status(200).json({ customer: updatedCustomer });
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating customer' });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const customerId = req.params.id;
        const deleted = await Customer.destroy({
            where: { customer_id: customerId }
        });

        if (deleted) {
            res.status(200).json({ message: 'Customer deleted' });
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting customer' });
    }
};