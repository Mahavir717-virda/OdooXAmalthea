import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');

  const fetchExpenses = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5001/api/expenses', {
      headers: { 'x-auth-token': token }
    });
    setExpenses(res.data.expenses);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleNewExpense = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const newExpense = { description, amount: Number(amount), category, date: new Date() };
    await axios.post('http://localhost:5001/api/expenses', newExpense, {
      headers: { 'x-auth-token': token }
    });
    fetchExpenses(); // Refresh list
    setDescription('');
    setAmount('');
  };

  const getStatusTotal = (status) => {
    return expenses
      .filter(exp => exp.status === status)
      .reduce((acc, curr) => acc + curr.amount, 0)
      .toFixed(2);
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Employee's View</h1>
      
      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '10px' }}>
          <h3>{getStatusTotal('To Submit')} rs</h3>
          <p>To Submit</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '10px' }}>
          <h3>{getStatusTotal('Waiting Approval')} rs</h3>
          <p>Waiting Approval</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '10px' }}>
          <h3>{getStatusTotal('Approved')} rs</h3>
          <p>Approved</p>
        </div>
      </div>

      {/* New Expense Form */}
      <form onSubmit={handleNewExpense} style={{ marginBottom: '20px' }}>
        <h3>Create New Expense</h3>
        <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required />
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" required />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option>Food</option>
          <option>Travel</option>
          <option>Supplies</option>
        </select>
        <button type="submit">New</button>
      </form>

      {/* Expenses Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #000' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Date</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Category</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Amount</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(exp => (
            <tr key={exp._id} style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '8px' }}>{exp.description}</td>
              <td style={{ padding: '8px' }}>{new Date(exp.date).toLocaleDateString()}</td>
              <td style={{ padding: '8px' }}>{exp.category}</td>
              <td style={{ padding: '8px' }}>{exp.amount.toFixed(2)}</td>
              <td style={{ padding: '8px' }}>{exp.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;