import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [expenses, setExpenses] = useState([]);
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [customCategory, setCustomCategory] = useState('');
    const [type, setType] = useState('expense'); // default to 'expense'
    const [date, setDate] = useState(''); // Date state

    const categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Salary', 'Investment'];

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        const res = await axios.get('http://localhost:5000/api/expenses');
        setExpenses(res.data);
    };

    const addExpense = async (e) => {
        e.preventDefault();
        const selectedCategory = category === 'Other' ? customCategory : category;

        const res = await axios.post('http://localhost:5000/api/expenses', { 
            title, 
            amount, 
            category: selectedCategory, 
            type, 
            date  // Include date
        });

        setExpenses([...expenses, res.data]);
        setTitle('');
        setAmount('');
        setCategory('');
        setCustomCategory('');
        setDate('');
    };

    const deleteExpense = async (id) => {
        await axios.delete(`http://localhost:5000/api/expenses/${id}`);
        setExpenses(expenses.filter(expense => expense._id !== id));
    };

    const filterByType = (type) => {
        return expenses.filter(expense => expense.type === type);
    };

    return (
        <div className="app">
            <div className="form-section">
                <h1>Add {type === 'income' ? 'Income' : 'Expense'}</h1>

                <form onSubmit={addExpense}>
                    <input 
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input 
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />

                    {/* Transaction Type: Expense or Income */}
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>

                    {/* Predefined Categories */}
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                        <option value="Other">Other</option>
                    </select>

                    {/* Custom Category Input */}
                    {category === 'Other' && (
                        <input
                            type="text"
                            placeholder="Custom Category"
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                        />
                    )}

                    {/* Date Input */}
                    <input 
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                    />

                    <button type="submit">Add {type === 'income' ? 'Income' : 'Expense'}</button>
                </form>
            </div>

            <div className="expense-section">
                <h2>Expenses</h2>
                <ul>
                    {filterByType('expense').map(expense => (
                        <li key={expense._id}>
                            {expense.title} - ₹{expense.amount} - {new Date(expense.date).toLocaleDateString()} - {expense.category}
                            <button onClick={() => deleteExpense(expense._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="income-section">
                <h2>Incomes</h2>
                <ul>
                    {filterByType('income').map(income => (
                        <li key={income._id}>
                            {income.title} - ₹{income.amount} - {new Date(income.date).toLocaleDateString()} - {income.category}
                            <button onClick={() => deleteExpense(income._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default App;
