//slug being in [] bracket indicates that the file is dynamic

import React, { useState } from 'react'
import { client, urlFor } from '../../lib/client'
import { AiOutlineMinus, AiOutlinePlus, AiOutlineStar, AiFillStar } from 'react-icons/ai'
import { Product } from '../../components'
import { useStateContext } from '../../context/StateContext'

const ProductDetails = ({ product, products }) => {
    const { image, name, details, price } = product //destructuring
    const [index, setIndex] = useState(0)
    const { decQty, incQty, qty, onAdd, setShowCart } = useStateContext()
    const buyNow = () => {
        onAdd(product, qty)
        setShowCart(true)
    }
    return (
        <div>
            <div className='product-detail-container'>
                <div>
                    <div className='image-container'>
                        <img className='product-detail-image' src={urlFor(image && image[index])} />
                    </div>
                    <div className='small-images-container'>
                        {image?.map((item, i) => (
                            <img key={i} src={urlFor(item)}
                                className={i === index ? 'small-image selected-image' : 'small-image'}//dynamic class based on if condition
                                onMouseEnter={() => setIndex(i)}
                            />
                        ))}
                    </div>
                </div>
                <div className='product-detail-desc'>
                    <h1>{name}</h1>
                    <div className='reviews'>
                        <div>
                            <AiFillStar />
                            <AiFillStar />
                            <AiFillStar />
                            <AiFillStar />
                            <AiOutlineStar />
                        </div>
                        <p>
                            (20)
                        </p>
                    </div>
                    <h4>Details: </h4>
                    <p>{details}</p>
                    <p className='price'>Rs.{price}</p>
                    <div className='quantity'>
                        <h3>Quantity:</h3>
                        <p className='quantity-desc'>
                            <span className='minus' onClick={decQty}><AiOutlineMinus /></span>
                            <span className='num'>{qty}</span>
                            <span className='plus' onClick={incQty}><AiOutlinePlus /></span>
                        </p>
                    </div>
                    <div className='buttons'>
                        <button type="button" className='add-to-cart' onClick={() => onAdd(product, qty)}>
                            Add to Cart
                        </button>
                        <button type="button" className='buy-now' onClick={buyNow}>
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
            <div className='maylike-products-wrapper'>
                <h2>You May Also Like:</h2>
                <div className='marquee'>
                    <div className='maylike-products-container track'>
                        {products.map((product) => (
                            <Product key={product._id}
                                product={product}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
//Whenever getStaticProps is used for dynamic Server side generated pages -> use getStaticPaths -? Because next.js needs to know where a user can click and go to another page in order to immediately load/show the data

export const getStaticPaths = async () => {
    const query = `*[_type=="product"]{ 
        slug {
            current
        }
    }` //Just return the current slug property
    const products = await client.fetch(query)
    const paths = products.map((product) => ({
        params: {
            slug: product.slug.current
        }
    }))//'{' alongwith '(' means an object is immediately being returned

    return {
        paths,
        fallback: 'blocking' //one of the ways to set the fallback acc to the documentation
    }
}

export const getStaticProps = async ({ params: { slug } }) => {
    const query = `*[_type == "product" && slug.current == '${slug}'][0]`
    const productsQuery = '*[_type == "product"]' //fetches all the products
    const product = await client.fetch(query) //individual product
    const products = await client.fetch(productsQuery)

    return {
        props: { products, product }
    }
}

export default ProductDetails
