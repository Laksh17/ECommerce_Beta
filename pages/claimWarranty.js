import React, { useState } from 'react'
import { client, urlFor } from '../lib/client'
import { useStateContext } from '../context/StateContext'
import ProductsNFT from '../components/ProductsNFT'
const handleproducts = (arrayObj) => {

}

const claimWarranty = ({ productsReq }) => {

    console.log(productsReq)
    return (
        <div className='products-container'>
            {productsReq[0]?.map((product) =>
                product.nft_status == false ?
                    <ProductsNFT key={product.product_item._id + productsReq.indexOf(product)} product={product} value={false} /> :
                    <div className='nothing'></div>
            )}
        </div>

    )
}


export const getServerSideProps = async (context) => {
    // const con = context.text()
    const query = `[*[_type == "transactions" && email == "${context.query.user}" && wallet_address == "${context.query.wallet}"].products_bought[]]`
    const productsReq = await client.fetch(query)

    return {
        props: { productsReq }
    }
}

export default claimWarranty