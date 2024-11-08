import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Login.css';

function Login() {


  const [fullName, setFullName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, accountNumber, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage(data.message);
        localStorage.setItem('token', data.token); // Store token if needed
        navigate('/make', { state: { accountNumber } }); // Navigate to CustPayment on successful login
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('An error occurred during login.');
    }
  };


  return (
    <div className="container">
    <form className="form" onSubmit={handleLogin}>
      <div className="form-group">
        <h1 className="form-title">Customer Login</h1>
        <div className="input-container">
          <input
            type="text"
            placeholder="Full Name"
            className="form-control"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="form-group">
        <div className="input-container">
          <input
            type="text"
            placeholder="Account Number"
            className="form-control"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="form-group">
        <div className="input-container">
          <input
            type="password"
            placeholder="Password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>

      {message && <p style={{ color: 'red' }}>{message}</p>}
      
      <button type="submit" className="submit">
        Login
      </button>

      <p class="signup-link" >
        No account?
        <a onClick={() => navigate('/Register')}> Sign up</a>
      </p>
    </form>
  </div>
);
}

export default Login;