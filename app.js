const express = require('express');
const app = express();
const customerRoutes = require('./routes/customerRoutes');
const foodRoutes = require('./routes/foodRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

app.use(express.json());

app.use('/api/customers', customerRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/transactions', transactionRoutes);

module.exports = app;
