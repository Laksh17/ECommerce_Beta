import React, { createContext, useContext, useState, useEffect } from "react";

import toast from "react-hot-toast";
import { client } from "../lib/client";
import getStripe from '../lib/getStripe'

const Context = createContext()

export const StateContext = ({ children }) => {
    const [imei, setImei] = useState('')
    const [user, setUser] = useState('')
    const [wallet, setWallet] = useState('')
    const [showCart, setShowCart] = useState(false)
    const [cartItems, setCartItems] = useState([]) //local storage functionality is added. empty array is needed to find items
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalQuantities, setTotalQuantities] = useState(0)
    const [qty, setQty] = useState(1)

    let foundProduct
    let index //Needed for the cart

    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find((item) => item._id === product._id)

        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity)
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity)
        if (checkProductInCart) {

            const updatedCartItems = cartItems.map((cartProduct) => {
                if (cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity,
                }
            })
            setCartItems(updatedCartItems)
        }
        else {
            product.quantity = quantity
            setCartItems([...cartItems, { ...product }])
            //... is for spreading out an object
        }
        console.log(...cartItems)
        toast.success(`${qty} ${product.name} added to the cart.`)
    }

    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id)
        const newCartItems = cartItems.filter((item) => item._id !== product._id)
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity)
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity)
        setCartItems(newCartItems)
    }

    // const destructureCartItems = (objArr) => {
    //     return objArr.map((item) => {
    //         return {
    //             item,

    //         }
    //     })
    // }


    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id)
        index = cartItems.findIndex((product) => product._id === id)
        const newCartItems = cartItems.filter((item) => item._id !== id)
        //filter is chosen over splice as mutating the state is a big NO!
        //A bug is still there to be fixed
        if (value === 'inc') {
            setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity + 1 }])
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price)
            setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1)
        } else if (value === 'dec') {
            if (foundProduct.quantity > 1) {
                setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity - 1 }])
                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price)
                setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1)
            }
        }
    }

    const setUserEmail = (input) => {
        setUser(input);
    }

    const handleCheckout = async () => {
        const stripe = await getStripe()

        //API to our own backend:
        const response = await fetch('/api/stripe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cartItems),
        })

        if (response.statusCode === 500) return
        const data = await response.json()

        // let data_cart = cartItems
        // console.log(data_cart)
        // data_json = data
        // console.log("data:", data_json)
        // console.log("cartItems", { cartItems })
        toast.loading('Redirecting...')
        stripe.redirectToCheckout({ sessionId: data.id })
    }

    const setWalletAddress = (input) => {
        try {
            setWallet(input.length >= 15 && input)
        }
        catch {
            console.log("Wallet address needs to be valid")
        }
    }

    const incQty = () => {
        setQty((prevQty) => prevQty + 1)
    }
    const decQty = () => {
        setQty((prevQty) => {
            if (prevQty - 1 < 1) return 1
            return prevQty - 1
        })
    }

    const saveTransaction = async (
        wallet_ = wallet,
        amount,
        userEmail = user,
        cartItems,
    ) => {

        const arrayCart = () => {
            return cartItems.map((item) => {
                let { quantity, ...itemEdited } = item
                return {
                    _key: 'key' + (new Date()).getTime() + cartItems.indexOf(item),
                    nft_status: false,
                    product_item: itemEdited,
                    quantity: cartItems[cartItems.indexOf(item)].quantity
                }
            })
        }

        let productsArr = arrayCart()

        // const txDoc = {
        //     _type: 'transactions',
        //     amount: amount,
        //     email: userEmail,
        //     wallet_address: wallet_,
        //     products_bought: productsArr
        // }

        // console.log(txDoc)
        try {
            await fetch(`/api/createTransaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    _type: 'transactions',
                    amount: amount,
                    email: userEmail,
                    wallet_address: wallet_,
                    products_bought: productsArr
                }),
            })

            handleCheckout()

        } catch (error) {
            console.log(error.message)
        }


    }


    return (
        <Context.Provider
            value={{
                imei,
                setImei,
                wallet,
                saveTransaction,
                showCart,
                setShowCart,
                setCartItems,
                setTotalPrice,
                setTotalQuantities,
                cartItems,
                totalPrice,
                totalQuantities,
                qty,
                incQty,
                decQty,
                onAdd,
                toggleCartItemQuantity,
                onRemove,
                setUserEmail,
                user,
                wallet,
                setWalletAddress,
            }}>
            {children}
        </Context.Provider>//Not rendering anything but just wrappin it
    )

}
export const useStateContext = () => useContext(Context)