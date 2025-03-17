const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/expense-tracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => console.error('MongoDB connection error:', err));

// Expense Model
const Expense = require('./models/Expense');

// Get all expenses
app.get('/api/expenses', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Add a new expense
app.post('/api/expenses', async (req, res) => {
    const { title, amount, category, type, date } = req.body;

    try {
        const expense = new Expense({ title, amount, category, type, date });
        await expense.save();
        res.json(expense);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete an expense
app.delete('/api/expenses/:id', async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});