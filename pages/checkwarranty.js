import React, { useState } from 'react'
import { client, urlFor } from '../lib/client'
import { useStateContext } from '../context/StateContext'
import ProductsNFT from '../components/ProductsNFT'
const checkWarranty = ({ productsReq }) => {
    const { imei } = useStateContext()
    productsReq.map((product) => {
        product.imeiNo = imei
    })
    console.log(productsReq)
    return (
        <div className='products-container'>
            {productsReq[0]?.map((product) =>
                product.nft_status == true ?
                    <ProductsNFT key={product.product_item._id + productsReq.indexOf(product)} product={product} value={true} /> :
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

export default checkWarranty