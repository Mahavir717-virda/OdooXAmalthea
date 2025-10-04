import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('USA'); // Default or fetch from API
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/register', { fullName, email, password, country });
      if (res.data.success) {
        alert('Registration successful! Please log in.');
        navigate('/login');
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full Name" required />
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
      <input type="text" value={country} onChange={e => setCountry(e.target.value)} placeholder="Country" required />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;