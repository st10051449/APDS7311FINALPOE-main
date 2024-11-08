// login form for employee

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Login.css';

function LoginEmp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    //initialising navigation
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // Clear previous error

        try {
            const response = await fetch('/api/auth/employee-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed. Please check your credentials.');
            }

            const data = await response.json();
            const token = data.token;

            // Store token in local storage for authenticated actions
            localStorage.setItem('employeeToken', token);

            alert('Login successful!');
            // Redirect or display employee dashboard
            navigate('/employee-home');

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="container">
            <form class="form" onSubmit={handleSubmit}>

                <div class="form-group">
                    <h1 className="form-title" >Employee Login</h1>
                    <div class="input-container">
                        <input
                            type="text"
                            placeholder="Username"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <div class="input-container">
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
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" className="submit">
                    Login
                </button>
            </form>
        </div>
    );
}

export default LoginEmp;