// Employee home page
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../HomeEmp.css';

function EmployeeHome() {
    const navigate = useNavigate();

    // Retrieve the JWT token from local storage
    const jwtToken = localStorage.getItem('employeeToken');

    useEffect(() => {
        if (!jwtToken) {
            navigate('/employee-login');
        }
    }, [jwtToken, navigate]);

    return (
        <div className="container">
            <h1 className="heading">Employee Home</h1>
            <div className="container">
                <div className="anim-container">
                    <div className="anim-card" onClick={() => navigate('/view-verified-payments')}>View Verified Payments</div>

                </div>
                <br />
                <br />
                <div className="anim-container-blue">
                    <div className="anim-card-blue" onClick={() => navigate('/view-payments')}>View All Unverified Payments</div>
                </div>
            </div>
        </div>
    );
}

export default EmployeeHome;
