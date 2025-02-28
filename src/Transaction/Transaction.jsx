import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import React from 'react'

const Transaction = () => {

    const wallet = useTonWallet();
    const [tonConnectUI, setOptions] = useTonConnectUI();


    const onLanguageChange = (lang) => {
        setOptions({
            language: lang,
            uiPreferences: {
                theme: THEME.DARK,
            },
        });
    };

    const myTransaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [
            {
                address: "0QDzW-KvuT7dcCnJbD_DNWR_xNaLlIc0vSOowa19YDFqqYop",
                amount: "20000000",
            },
            {
                address: "0QDzW-KvuT7dcCnJbD_DNWR_xNaLlIc0vSOowa19YDFqqYop",
                amount: "60000000",
            },
        ],
    };

    return (
        <div>Transaction :
            {wallet ? (
                <button
                    onClick={async () =>
                        await tonConnectUI.sendTransaction(myTransaction)
                    }
                >
                    Send transaction
                </button>
            ) : (
                <button onClick={() => tonConnectUI.openModal()}>
                    Connect wallet to send the transaction
                </button>
            )}
            <div>
                <label>language</label>
                <select onChange={(e) => onLanguageChange(e.target.value)}>
                    <option value="en">en</option>
                    <option value="ru">ru</option>
                </select>
            </div>
        </div>
    )
}

export default Transaction