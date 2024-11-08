import React, { useEffect, useState } from 'react';
import '../ViewPayments.css';

function ViewVerifiedPayments() {
    const [verifiedPayments, setVerifiedPayments] = useState([]);
    const [error, setError] = useState(null);

    // Get JWT token for authorized access
    const jwtToken = localStorage.getItem('employeeToken');

    // Fetch verified payments from API on component mount
    useEffect(() => {
        const fetchVerifiedPayments = async () => {
            try {
                const response = await fetch('/api/employee/verified-payments', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch verified payments');
                }

                const data = await response.json();
                setVerifiedPayments(data); // Assumes `data` is an array of verified payment objects
            } catch (err) {
                setError(err.message);
            }
        };

        fetchVerifiedPayments();
    }, [jwtToken]);

    return (
        <div className="container">
            <h1>Verified Payments</h1>
            {error ? (
                <p style={{ color: 'red' }}>Error: {error}</p>
            ) : (
                <ul>
                    {verifiedPayments.map((payment, index) => (
                        <li className="soft-rounded-card" key={index}>
                            <p><strong>Payer Account Number:</strong> {payment.payerAccountNumber}</p>
                            <p><strong>Amount:</strong> {payment.amount}</p>
                            <p><strong>Currency:</strong> {payment.currency}</p>
                            <p><strong>Provider:</strong> {payment.provider}</p>
                            <p><strong>Payee Account Number:</strong> {payment.payeeAccountNumber}</p>
                            <p><strong>Payee Account Owner:</strong> {payment.payeeAccountOwner}</p>
                            <p><strong>Swift Code:</strong> {payment.swiftCode}</p>
                            <hr />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ViewVerifiedPayments;