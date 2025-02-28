import React, { useState } from 'react';
import { useTonConnect } from '../hooks/useTonConnect';
import { Address } from '@ton/core';

function TestTransaction() {
    const { sender, connected } = useTonConnect();
    const [recipient, setRecipient] = useState("0QCiLgk_qgGXKOsY_QZj6-6c_ArgUL9QK4N7fQj4hbTb9nWi"); 
    const [amount, setAmount] = useState("0.1");
    const [status, setStatus] = useState("");

    const handleSend = async () => {
        console.log("Connected status => ", connected);
        setStatus("");

        if (connected) {
            alert("Please connect your wallet first!");
            return;
        }

        const nanoAmount = BigInt(Math.floor(parseFloat(amount) * 10 ** 9));
        if (nanoAmount <= 0) {
            setStatus("Error: Amount must be greater than 0");
            return;
        }

        try {
            setStatus("Sending transaction...");
            await sender.send({
                to: Address.parse(recipient),
                value: nanoAmount,
                body: null,
            });
            setStatus("Transaction sent successfully!");
            console.log("Transaction sent successfully!");
        } catch (error) {
            console.error("Transaction failed:", error);
            setStatus(`Transaction failed: ${error.message}`);
        }
    };

    return (
        <div>
            <h3>Send Test TON</h3>
            <div>
                <label>Recipient Address: </label>
                <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Enter TON testnet address"
                    style={{ width: '300px', marginBottom: '10px' }}
                />
            </div>
            <div>
                <label>Amount (TON): </label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount in TON"
                    step="0.01"
                    min="0"
                    style={{ marginBottom: '10px' }}
                />
            </div>
            <button onClick={handleSend} disabled={connected}>
                Send {amount} TON
            </button>
            {status && <p style={{ color: status.includes("failed") ? "red" : "green" }}>{status}</p>}
        </div>
    );
}

export default TestTransaction;