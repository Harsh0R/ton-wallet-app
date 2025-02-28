import { ethers } from "ethers";
import { useTonConnect } from "../hooks/useTonConnect";
import { Address } from '@ton/core';

function TestTransaction() {
    const { sender, connected } = useTonConnect();

    const handleSend = async () => {
        console.log("connecting... => ", connected);

        if (connected) {
            alert("Please connect your wallet first!");
            return;
        }
        // const amount = ethers.utils.parseEther("0.1");
        try {
            await sender.send({
                to: Address.parse("0QCiLgk_qgGXKOsY_QZj6-6c_ArgUL9QK4N7fQj4hbTb9nWi"),
                value: "100000000",
                body: null,
            });
            console.log("Transaction sent successfully!");
        } catch (error) {
            console.error("Transaction failed:", error);
        }
    };

    return (<button onClick={handleSend}>Send 0.1 Test TON</button>)
}

export default TestTransaction;