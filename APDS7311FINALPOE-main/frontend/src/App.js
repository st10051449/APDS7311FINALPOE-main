import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Register from './components/Register';
import LoginEmp from './components/LoginEmp';
import EmployeeHome from './components/HomeEmp';
import GreetingPage from './components/GreetingPage';
import LoginCust from './components/LoginCust';
import CustPayment from './components/CustPayment';
import ViewPayments from './components/ViewPayments';
import ViewVerifiedPayments from './components/ViewVerifiedPayments';
import './App.css'

// Function to check if the user is authenticated
const isAuthenticated = () => !!localStorage.getItem('employeeToken');

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/employee-login" element={<LoginEmp />} />
                <Route path="/greeting-page" element={<GreetingPage />} />
                <Route path="/view-payments" element={<ViewPayments />} />
                <Route path="/view-verified-payments" element={<ViewVerifiedPayments />} />
                <Route path="/Login" element={<LoginCust />} />
                <Route path="/make" element={<CustPayment/>}/>
                <Route
                    path="/employee-home"
                    element={isAuthenticated() ? <EmployeeHome /> : <Navigate to="/employee-login" />}
                />
                {/* Redirect unknown routes to the greeting page*/}
                <Route path="*" element={<Navigate to="/greeting-page" />} />
            </Routes>
        </Router>
    );
}

export default App;
