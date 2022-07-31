import React from 'react'
import Link from 'next/link'
import { AiOutlineShopping } from 'react-icons/ai'
import { Cart } from './'
import { useStateContext } from '../context/StateContext'
import { Wallet } from 'ethers'
const Navbar = () => {
    const { wallet, showCart, setShowCart, totalQuantities, user } = useStateContext()

    return (
        <div className='navbar-container'>
            <p className='logo'>
                Sound Doctor
            </p>
            <p className='logo'>
                {user}
            </p>

            {user != "" && wallet != "" ? <button type="button" className='claim-warranty'>
                <Link href={{
                    pathname: "/claimWarranty",
                    query: {
                        user: user,
                        wallet: wallet
                    }

                }} > Claim Warranty </Link>
            </button>
                : <a href="/">Please Login</a>}

            {user && wallet ? <button type="button" className='check-warranty' onclick="">
                <Link href={{
                    pathname: "/checkwarranty",
                    query: {
                        user: user,
                        wallet: wallet
                    }

                }} > Check Warranty </Link>
            </button> : <div></div>

            }

            <button type="button" className='cart-icon' onClick={() => setShowCart(true)}>
                <AiOutlineShopping />
                <span className='"cart-item-qty'>{totalQuantities}</span>
            </button>
            {showCart && <Cart />}
        </div >
    )
}

export default Navbar