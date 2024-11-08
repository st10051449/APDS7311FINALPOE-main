// Greeting page
//this should be the default landing page of the website
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../HomeEmp.css';

function GreetingPage() {
    const navigate = useNavigate();

    return (
        <div className="container">
            <h1 className="heading">Welcome to the Secure Payments Portal</h1>

                <div className="anim-container">
                    <div
                        className="anim-card"
                        onClick={() => navigate('/employee-login')}
                    >
                        Login Employee
                    </div>
                </div>
                <br/>
                <br/>
                <br/>
                <br/>
                <div className="anim-container-blue">
                    <div
                        className="anim-card-blue"
                        onClick={() => navigate('/login')}
                    >
                        Login Customer
                    </div>
                </div>

        </div>
    );
}

export default GreetingPage;