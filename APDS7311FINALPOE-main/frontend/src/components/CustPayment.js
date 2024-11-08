import React, { useState, useEffect }from 'react';
import { useLocation } from 'react-router-dom';

function CustPayment() {

    const location = useLocation();


    const [payerAccountNumber, setPayerAccountNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('ZAR'); // Default to 'ZAR'
    const [provider, setProvider] = useState('SWIFT'); // Default to 'SWIFT'
    const [payeeAccountNumber, setPayeeAccountNumber] = useState('');
    const [payeeAccountOwner, setPayeeAccountOwner] = useState('');
    const [swiftCode, setSwiftCode] = useState('');
    const [message, setMessage] = useState('');
    const [paymentId, setPaymentId] = useState('');

     // Use useEffect to autofill the payerAccountNumber from the login page
     useEffect(() => {
        if (location.state && location.state.accountNumber) {
            setPayerAccountNumber(location.state.accountNumber); // Autofill account number
        }
    }, [location.state]);

    const handlePayment = async (event) => {
        event.preventDefault();

        try {
            const token = localStorage.getItem('token');


            const response = await fetch('/api/payments/make', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    payerAccountNumber,
                    amount: parseFloat(amount),
                    currency,
                    provider,
                    payeeAccountNumber,
                    payeeAccountOwner,
                    swiftCode,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setPaymentId(data.paymentId);
            } else {
                setMessage(data.message || 'Payment failed');
            }
        } catch (error) {
            console.error('Error during payment:', error);
            setMessage('An error occurred during payment.');
        }
    };

    return (
        <div className="container">
            <h2>Make a Payment</h2>
            <form onSubmit={handlePayment}>

                <label>
                    Payer Account Number:
                    <input
                        type="text"
                        value={payerAccountNumber}
                        onChange={(e) => setPayerAccountNumber(e.target.value)}
                        required
                    />
                </label>
                <br />

                <label>
                    Amount:
                    <input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </label>
                <br />

                <label>
                    Currency:
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        required
                    >
                        <option value="ZAR">ZAR (South African Rand)</option>
                        <option value="USD">USD (US Dollar)</option>
                        <option value="GBP">GBP (British Pound)</option>
                    </select>
                </label>
                <br />

                <label>
                    Provider:
                    <input
                        type="text"
                        value={provider}
                        onChange={(e) => setProvider(e.target.value)}
                        required
                    />
                </label>
                <br />

                <label>
                    Payee Account Number:
                    <input
                        type="text"
                        value={payeeAccountNumber}
                        onChange={(e) => setPayeeAccountNumber(e.target.value)}
                        required
                    />
                </label>
                <br />

                <label>
                    Payee Account Owner:
                    <input
                        type="text"
                        value={payeeAccountOwner}
                        onChange={(e) => setPayeeAccountOwner(e.target.value)}
                        required
                    />
                </label>
                <br />

                <label>
                    SWIFT Code:
                    <input
                        type="text"
                        value={swiftCode}
                        onChange={(e) => setSwiftCode(e.target.value)}
                        required
                    />
                </label>
                <br />

                <button type="submit">Submit Payment</button>
            </form>
            {message && <p>{message}</p>}
            {paymentId && <p>Payment ID: {paymentId}</p>}
        </div>
    );
}

export default CustPayment;
