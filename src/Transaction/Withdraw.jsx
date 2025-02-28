import React, { useState } from 'react';
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, WalletContractV4, internal, Address } from "@ton/ton";

function Withdraw() {
    const [mnemonic, setMnemonic] = useState(
        "tourist simple sphere ready ozone arrest faculty dad famous legal invest ethics letter hammer coast acquire apple leaf insect dawn whale grab fiction pizza"
    );
    const [recipient, setRecipient] = useState("0QCiLgk_qgGXKOsY_QZj6-6c_ArgUL9QK4N7fQj4hbTb9nWi");
    const [amount, setAmount] = useState("0.05");
    const [message, setMessage] = useState("Hello");
    const [status, setStatus] = useState("");
    const [walletAddress, setWalletAddress] = useState(""); // To display wallet address

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const handleWithdraw = async () => {
        setStatus("");
        try {
            setStatus("Preparing withdrawal...");

            // Validate mnemonic
            if (!mnemonic || mnemonic.split(" ").length !== 24) {
                setStatus("Error: Please enter a valid 24-word mnemonic");
                return;
            }

            // Validate TON address
            let parsedAddress;
            try {
                parsedAddress = Address.parse(recipient);
            } catch (e) {
                setStatus("Error: Please enter a valid TON recipient address (e.g., 0Q... or EQ...)");
                return;
            }

            // Validate amount
            const tonAmount = parseFloat(amount);
            if (isNaN(tonAmount) || tonAmount <= 0) {
                setStatus("Error: Amount must be greater than 0");
                return;
            }

            
            const key = await mnemonicToWalletKey(mnemonic.split(" "));
            const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
            setWalletAddress(wallet.address.toString()); 

            // Connect to TON Testnet
            const endpoint = await getHttpEndpoint({ network: "testnet" });
            const client = new TonClient({ endpoint });

            // Check if wallet is deployed
            // if (!await client.isContractDeployed(wallet.address)) {
            //     setStatus(
            //         `Error: Wallet is not deployed on the Testnet. Please fund this address with test TON first: ${wallet.address.toString()}`
            //     );
            //     return;
            // }

            // Open wallet contract
            const walletContract = client.open(wallet);
            const seqno = await walletContract.getSeqno();
            console.log("wallet => ", wallet.publicKey.toString());
            
            // Send transfer
            setStatus("Sending withdrawal transaction...");
            await walletContract.sendTransfer({
                secretKey: key.secretKey,
                seqno: seqno,
                messages: [
                    internal({
                        to: parsedAddress.toString(),
                        value: tonAmount.toString(), // Amount in TON (string format)
                        body: message,
                        bounce: false,
                    }),
                ],
            });

            // Wait for confirmation
            let currentSeqno = seqno;
            while (currentSeqno === seqno) {
                setStatus("Waiting for transaction to confirm...");
                await sleep(1500);
                currentSeqno = await walletContract.getSeqno();
            }

            setStatus("Withdrawal confirmed successfully!");
            console.log("Transaction confirmed!");
        } catch (error) {
            console.error("Withdrawal failed:", error);
            setStatus(`Withdrawal failed: ${error.message}`);
        }
    };

    return (
        <div className="p-4 bg-gray-900 text-white min-h-screen flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">Withdraw TON (Testnet)</h3>
            <div className="w-full max-w-md space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Mnemonic (24 words)</label>
                    <textarea
                        value={mnemonic}
                        onChange={(e) => setMnemonic(e.target.value)}
                        placeholder="Enter your 24-word mnemonic"
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Recipient Address</label>
                    <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="Enter TON testnet address (e.g., 0Q...)"
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
                <div>
                    <label className="block text-sm font-medium mb-1">Message (Optional)</label>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter a message"
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={handleWithdraw}
                    className="w-full py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                    Withdraw {amount} TON
                </button>
                {walletAddress && (
                    <p className="text-sm text-gray-400 mt-2 break-all">
                        Your Wallet Address: {walletAddress}
                    </p>
                )}
                {status && (
                    <p
                        className={`text-center mt-2 ${status.includes("failed") || status.includes("Error")
                            ? 'text-red-500'
                            : 'text-green-500'
                            }`}
                    >
                        {status}
                    </p>
                )}
                {status.includes("not deployed") && (
                    <p className="text-sm text-yellow-400 mt-2">
                        Fund your wallet using the TON Testnet faucet: Send your wallet address to @testgiver_ton_bot on Telegram.
                    </p>
                )}
            </div>
        </div>
    );
}

export default Withdraw;