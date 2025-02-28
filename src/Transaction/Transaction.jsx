import React, { useState } from 'react';
import { useTonConnectUI, useTonWallet, THEME } from '@tonconnect/ui-react';

const Transaction = () => {
    const wallet = useTonWallet();
    const [tonConnectUI, setOptions] = useTonConnectUI();
    const [recipient, setRecipient] = useState("0QCiLgk_qgGXKOsY_QZj6-6c_ArgUL9QK4N7fQj4hbTb9nWi"); 
    const [amount, setAmount] = useState("1"); 
    const [status, setStatus] = useState("");

    const onLanguageChange = (lang) => {
        setOptions({
            language: lang,
            uiPreferences: {
                theme: THEME.DARK,
            },
        });
    };

    const handleSendTransaction = async () => {
        setStatus(""); 

        if (!wallet) {
            setStatus("Please connect your wallet first!");
            return;
        }

        const nanoAmount = (parseFloat(amount) * 10 ** 9).toString();
        if (parseFloat(nanoAmount) <= 0) {
            setStatus("Error: Amount must be greater than 0");
            return;
        }

        const myTransaction = {
            validUntil: Math.floor(Date.now() / 1000) + 60,
            messages: [
                {
                    address: recipient,
                    amount: nanoAmount, 
                },
            ],
        };

        try {
            setStatus("Sending transaction...");
            await tonConnectUI.sendTransaction(myTransaction);
            setStatus("Transaction sent successfully!");
        } catch (error) {
            console.error("Transaction failed:", error);
            setStatus(`Transaction failed: ${error.message}`);
        }
    };

    return (
        <div>
            <h3>Transaction</h3>
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
            {wallet ? (
                <button onClick={handleSendTransaction}>
                    Send {amount} TON
                </button>
            ) : (
                <button onClick={() => tonConnectUI.openModal()}>
                    Connect wallet to send the transaction
                </button>
            )}
            <div style={{ marginTop: '10px' }}>
                <label>Language: </label>
                <select onChange={(e) => onLanguageChange(e.target.value)}>
                    <option value="en">English</option>
                    <option value="ru">Russian</option>
                </select>
            </div>
            {status && <p style={{ color: status.includes("failed") ? "red" : "green" }}>{status}</p>}
        </div>
    );
};

export default Transaction;