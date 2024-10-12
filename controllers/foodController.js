const { Op } = require('sequelize');
const Food = require('../models/foodModel');

exports.getFoods = async (req, res) => {
    try {
        const foods = await Food.findAll();
        res.json({
            message: "success",
            data: foods
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getAllFoods = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        let whereClause = {};
        
        if (search) {
            const searchNumber = parseFloat(search);
            whereClause = {
                [Op.or]: [
                    { food_name: { [Op.like]: `%${search}%` } },
                    ...(isNaN(searchNumber) ? [] : [
                        { price: { [Op.eq]: searchNumber } },
                        { stock: { [Op.eq]: searchNumber } }
                    ])
                ]
            };
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);

        const { count, rows } = await Food.findAndCountAll({
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


exports.createFood = async (req, res) => {
    const { food_name, price, stock } = req.body;
    try {
        const newFood = await Food.create({ food_name, price, stock });
        res.status(201).json(newFood);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateFood = async (req, res) => {
    try {
        const foodId = req.params.id;
        const [updated] = await Food.update(req.body, {
            where: { food_id: foodId }
        });

        if (updated) {
            const updatedFood = await Food.findOne({ where: { food_id: foodId } });
            res.status(200).json({ food: updatedFood });
        } else {
            res.status(404).json({ message: 'Food not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating food' });
    }
};

exports.deleteFood = async (req, res) => {
    try {
        const foodId = req.params.id;
        const deleted = await Food.destroy({
            where: { food_id: foodId }
        });

        if (deleted) {
            res.status(200).json({ message: 'Food deleted' });
        } else {
            res.status(404).json({ message: 'Food not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting food' });
    }
};
