const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('onlineshop', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres'
});

sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

module.exports = sequelize;
