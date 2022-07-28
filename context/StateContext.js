import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

import toast from "react-hot-toast";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
const Context = createContext()
const Web3Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false)
    const [cartItems, setCartItems] = useState([]) //local storage functionality is added. empty array is needed to find items
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalQuantities, setTotalQuantities] = useState(0)
    const [qty, setQty] = useState(1)
    const [web3api, setWeb3api] = useState({
        web3:null,
        provider:null,
        contract:null,
        isLoaded:true
    })

    useEffect(() => {
        const loadProvider = async () => {
        const provider = await detectEthereumProvider();
        if(provider) {
        const web3 = new Web3(provider);
        setWeb3api({
         web3,
         provider,
         contract:null,
         isLoading:false
        })
        } else {
         setWeb3api(api => ({...api, isLoading:false}))
         console.error("Please, install Metamask.")
        }
        }
        loadProvider()
       },[])

    const _web3Api = useMemo(() => {
        const { web3, provider } = web3api;
       return {
       ...web3api,
       isWeb3Loaded  : web3 != null,
       connect : provider ? 
       async () =>  {try {
        await provider.request({method: "eth_requestAccounts"});
       } catch (error) {
        location.reload()
       }}:
       () => {console.error("Couldn't Connect to Metamask!")}
       }
      },[web3api])


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
                    quantity: cartProduct.quantity + quantity
                }
            })
            setCartItems(updatedCartItems)
        }
        else {
            product.quantity = quantity
            setCartItems([...cartItems, { ...product }])
            //... is for spreading out an object
        }
        console.log("success")
        toast.success(`${qty} ${product.name} added to the cart.`)
    }

    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id)
        const newCartItems = cartItems.filter((item) => item._id !== product._id)
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity)
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity)
        setCartItems(newCartItems)
    }

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

    const incQty = () => {
        setQty((prevQty) => prevQty + 1)
    }
    const decQty = () => {
        setQty((prevQty) => {
            if (prevQty - 1 < 1) return 1
            return prevQty - 1
        })
    }
    return (
        <Web3Context.Provider value={_web3Api}>
        <Context.Provider
            value={{
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
            }}>
            {children}
        </Context.Provider>//Not rendering anything but just wrappin it
        </Web3Context.Provider>
    )
}

export const useStateContext = () => useContext(Context) 

export function useWeb3() {
  return useContext(Web3Context);
}
