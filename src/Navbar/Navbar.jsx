import { TonConnectButton } from '@tonconnect/ui-react'

import React from 'react'

const Navbar = () => {

    return (
        <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
            <h1 className="text-lg font-bold">TON Wallet</h1>
            <div className="flex items-center">
                <TonConnectButton className="rounded-lg py-2 px-4" />
            </div>
        </nav>
    )
}

export default Navbar