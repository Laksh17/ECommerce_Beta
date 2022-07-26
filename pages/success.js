import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { BsBagCheckFill } from 'react-icons/bs'
import { runFireWorks } from '../lib/utils'
import { useStateContext } from '../context/StateContext'

const Success = () => {
    const { setCartItems, setTotalPrice, setTotalQuantities } = useStateContext()

    useEffect(() => {
        localStorage.clear()
        setCartItems([])
        setTotalPrice(0)
        setTotalQuantities(0)
        runFireWorks()
    }, [])//dependency array is empty -> executes as soon as the page loads

    return (
        <div className='success-wrapper'>
            <div className='success'>
                <p className='icon'>
                    <BsBagCheckFill />
                </p>
                <h2>Your Transaction was Successful!</h2>
                <p className='email-msg'>Check your email inbox for the receipt</p>
                <p className='description'>
                    If you have any questions, please email
                    <a className='email' href="mailto:order@example.com">
                        sounddoctor@gmail.com
                    </a>
                </p>
                <Link href="/">
                    <button type="button" width="300px" className='btn'>
                        Continue Shopping
                    </button>
                </Link>
            </div>
        </div>

    )
}

export default Success