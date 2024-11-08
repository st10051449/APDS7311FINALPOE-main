import React, { useEffect, useState } from 'react';
import '../ViewPayments.css';

function ViewPayments() {
    const [payments, setPayments] = useState([]);
    const [error, setError] = useState(null);

    // Get JWT token for authorized access
    const jwtToken = localStorage.getItem('employeeToken');

    // Fetch unverified payments from API on component mount
    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await fetch('/api/employee/payments', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch payments');
                }

                const data = await response.json();
                setPayments(data); // Assumes `data` is an array of payment objects
            } catch (err) {
                setError(err.message);
            }
        };

        fetchPayments();
    }, [jwtToken]);

    // Function to handle payment verification
    const verifyPayment = async (paymentId) => {
        try {
            const response = await fetch(`/api/employee/payments/${paymentId}/verify`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to verify payment');
            }

            const data = await response.json();
            alert(data.message); // Show verification success message

            // Update the state to remove the verified payment from the list
            setPayments(payments.filter(payment => payment._id !== paymentId));

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container">
            <h1>Unverified Payments</h1>
            {error ? (
                <p style={{ color: 'red' }}>Error: {error}</p>
            ) : (
                <ul >
                    {payments.map((payment, index) => (
                        <li className="soft-rounded-card" key={index}>
                            <p><strong>Payer Account Number:</strong> {payment.payerAccountNumber}</p>
                            <p><strong>Amount:</strong> {payment.amount}</p>
                            <p><strong>Currency:</strong> {payment.currency}</p>
                            <p><strong>Provider:</strong> {payment.provider}</p>
                            <p><strong>Payee Account Number:</strong> {payment.payeeAccountNumber}</p>
                            <p><strong>Payee Account Owner:</strong> {payment.payeeAccountOwner}</p>
                            <p><strong>Swift Code:</strong> {payment.swiftCode}</p>
                            <div className="container">
                                <button onClick={() => verifyPayment(payment._id)}>Verify</button>
                            </div>
                            <hr />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ViewPayments;
