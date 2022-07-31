import React from 'react'
import { useState } from 'react';
import { useStateContext } from '../context/StateContext'

const Login = () => {
    const { wallet, setWalletAddress, user, setUserEmail } = useStateContext();

    const [inputs, setInputs] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    const handleSubmit = (event) => {
        setUserEmail(inputs.email)
        setWalletAddress(inputs.wallet)
    }

    return (
        <div className='login-page'>
            <form className='login-form' onSubmit={handleSubmit}>
                <label>Enter your name:
                    <input
                        type="email"
                        name="email"
                        value={inputs.email || ""}
                        onChange={handleChange}
                    />
                </label>
                <label>Enter your wallet address:
                    <input
                        type="text"
                        name="wallet"
                        value={inputs.wallet || ""}
                        onChange={handleChange}
                    />
                </label>
                <input className='submit' type="submit" />
            </form>
        </div>
    )
}

export default Login