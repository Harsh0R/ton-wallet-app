import React, { useState } from 'react';
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, WalletContractV4, internal, Address, WalletContractV5R1 } from "@ton/ton";

function Withdraw() {
    const [mnemonic, setMnemonic] = useState(
        "tourist simple sphere ready ozone arrest faculty dad famous legal invest ethics letter hammer coast acquire apple leaf insect dawn whale grab fiction pizza"
    );
    const [recipient, setRecipient] = useState(""); 
    const [amount, setAmount] = useState("0.05");
    const [message, setMessage] = useState("Hello");
    const [status, setStatus] = useState("");
    const [walletAddress, setWalletAddress] = useState("");

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const handleWithdraw = async () => {
        setStatus("");
        try {
            setStatus("Preparing withdrawal...");

            if (!mnemonic || mnemonic.split(" ").length !== 24) {
                setStatus("Error: Please enter a valid 24-word mnemonic");
                return;
            }

            let parsedAddress;
            try {
                parsedAddress = Address.parse(recipient);
            } catch (e) {
                setStatus("Error: Please enter a valid TON recipient address (e.g., EQ... or UQ...)");
                return;
            }

            const tonAmount = parseFloat(amount);
            if (isNaN(tonAmount) || tonAmount <= 0) {
                setStatus("Error: Amount must be greater than 0");
                return;
            }

            const key = await mnemonicToWalletKey(mnemonic.split(" "));
            const wallet = WalletContractV5R1.create({ publicKey: key.publicKey, workchain: 0 });
            setWalletAddress(wallet.address.toString());

            const endpoint = await getHttpEndpoint({ network: "mainnet" });
            // const endpoint = "https://nameless-late-aura.ton-mainnet.quiknode.pro/0cb691e4246d7eda4a7858ef832c2f7d53c0a09f/";


            const client = new TonClient({ endpoint });


            const balance = await client.getBalance(wallet.address);
            console.log("Wallet balance:", balance.toString(), "nanoTON");
            if (balance < tonAmount * 1e9 + 0.05 * 1e9) { 
                setStatus("Error: Insufficient funds. Fund the wallet with more TON.");
                return;
            }

            // Check if wallet is deployed
            // const isDeployed = await client.isContractDeployed(wallet.address);
            // if (!isDeployed) {
            //     setStatus(
            //         `Error: Wallet is not deployed on the Mainnet. Please fund this address with TON first: ${wallet.address.toString()}`
            //     );
            //     return;
            // }

            
            const walletContract = client.open(wallet);
            const seqno = await walletContract.getSeqno();
            console.log("Wallet public key:", key.publicKey.toString('hex'));

            setStatus("Sending withdrawal transaction...");
            await walletContract.sendTransfer({
                secretKey: key.secretKey,
                seqno: seqno,
                messages: [
                    internal({
                        to: parsedAddress.toString(),
                        value: tonAmount.toString(), 
                        body: message,
                        bounce: false,
                    }),
                ],
            });

            
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
            if (error.response && error.response.status === 500) {
                setStatus("Withdrawal failed: TON network error (500). Check wallet deployment or try again later.");
            } else {
                setStatus(`Withdrawal failed: ${error.message}`);
            }
        }
    };

    return (
        <div className="p-4 bg-gray-900 text-white min-h-screen flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">Withdraw TON (Mainnet)</h3>
            <p className="text-yellow-400 text-sm mb-4 text-center">
                Warning: This operates on the TON Mainnet with real funds. Proceed with caution!
            </p>
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
                        placeholder="Enter TON mainnet address (e.g., EQ...)"
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
                        className={`text-center mt-2 ${status.includes("failed") || status.includes("Error") ? 'text-red-500' : 'text-green-500'
                            }`}
                    >
                        {status}
                    </p>
                )}
                {status.includes("not deployed") && (
                    <p className="text-sm text-yellow-400 mt-2">
                        Fund your wallet with TON from an exchange or another wallet to deploy it on the Mainnet.
                    </p>
                )}
            </div>
        </div>
    );
}

export default Withdraw;