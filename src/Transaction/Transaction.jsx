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
        <div className="p-4 bg-gray-900 text-white flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">Transaction</h3>
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
                {wallet ? (
                    <button
                        onClick={handleSendTransaction}
                        className="w-full py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Send {amount} TON
                    </button>
                ) : (
                    <button
                        onClick={() => tonConnectUI.openModal()}
                        className="w-full py-3 bg-gray-600 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                    >
                        Connect Wallet
                    </button>
                )}
                <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Language</label>
                    <select
                        onChange={(e) => onLanguageChange(e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="en">English</option>
                        <option value="ru">Russian</option>
                    </select>
                </div>
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
};

export default Transaction;