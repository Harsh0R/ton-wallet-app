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

        if (!connected) {
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
        <div className="p-4 bg-gray-900 text-white flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">Send Test TON</h3>
            <div className="w-full max-w-md space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Recipient Address</label>
                    <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="Enter TON testnet address"
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Amount (TON)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount in TON"
                        step="0.01"
                        min="0"
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={handleSend}
                    disabled={!connected}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${connected ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 cursor-not-allowed'
                        }`}
                >
                    Send {amount} TON
                </button>
                {status && (
                    <p
                        className={`text-center mt-2 ${status.includes("failed") ? 'text-red-500' : 'text-green-500'
                            }`}
                    >
                        {status}
                    </p>
                )}
            </div>
        </div>
    );
}

export default TestTransaction;