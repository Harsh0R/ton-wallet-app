import { TonConnectButton, useTonAddress, useTonWallet } from '@tonconnect/ui-react'

import React, { useEffect } from 'react'

const Navbar = () => {

    const userAddress = useTonAddress();
    const wallet = useTonWallet();
    useEffect(() => {
        console.log("wallet => ", wallet)
    }, [])
    
    return (
        <div>
            <TonConnectButton />
            {/* {
                userAddress ? <p>Your address: {userAddress}</p> : null
            } */}
        </div>
    )
}

export default Navbar