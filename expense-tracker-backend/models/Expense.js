const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        required: true
    },
    type: {
        type: String, // "income" or "expense"
        required: true
    }
});

module.exports = mongoose.model('Expense', ExpenseSchema);
