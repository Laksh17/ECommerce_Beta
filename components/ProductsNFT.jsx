import React from 'react'
import Link from 'next/dist/client/link'
import { urlFor } from '../lib/client'
import { useState } from 'react'
import { useStateContext } from '../context/StateContext'
import toast from 'react-hot-toast'

const ProductsNFT = ({ product: { product_item, quantity, _id }, value }) => {

    const [inputs, setInputs] = useState({});

    const { imei, setImei } = useStateContext();

    console.log(value)

    const handleSubmit = (event) => {
        setImei(inputs.imei)
    }

    const handleClaim = () => {
        toast.success("Your Warranty can be claimed")
    }

    const sendNft = () => {
        toast.success(`${product_item.name} has been issued an nft with ${imei}`)
    }

    return (
        <div>
            <div className='product-card'>
                <img src={urlFor(product_item.image && product_item.image[0])}
                    width={250}
                    height={250}
                    className='product-image'
                    alt='' />
                <p className='product-name'>{product_item.name}</p>
                <p className='product-price'>Rs.{product_item.price}</p>
                {value ? <p>IMEI Number: 910595602198929</p> : <div></div>}{value ? <button type="button" onClick={handleClaim}>Claim Warranty</button> : <div></div>}
                {value == false ? <form className='nft-field' onSubmit={handleSubmit}>
                    <label>Enter your IMEI Number:
                        <input
                            type="text"
                            name="IMEI_Number"
                            value={imei}
                            onChange={(e) => setImei(e.target.value)}
                        />
                    </label>
                    <input type="submit" onClick={() => sendNft} />
                </form> :
                    <div></div>}
            </div>
        </div>
    )
}

export default ProductsNFT