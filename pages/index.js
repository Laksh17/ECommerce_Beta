import React from 'react'
import { client } from '../lib/client'
import { Product, FooterBanner, HeroBanner } from '../components'
import { useStateContext } from '../context/StateContext'
import Login from '../components/Login'
const Home = ({ products, bannerData }) => {
  const { user, wallet } = useStateContext()
  console.log({ user }, { wallet })

  // const handleEmail = () => {
  //   const email = prompt('Enter your Email');
  //   setUserEmail({ input: email })
  // }

  return (
    user == '' && wallet == '' ?
      <div>
        <Login />
      </div>

      : <div>
        <HeroBanner heroBanner={bannerData.length && bannerData[0]} />
        <div className='products-heading'>
          <h2>
            Best Selling Products
          </h2>
          <p>Speakers that please one and all!</p>
        </div>
        <div className='products-container'>
          {products?.map((product) => <Product key={product._id} product={product} />)}
        </div>
        <FooterBanner footerBanner={bannerData && bannerData[0]} />
      </div>
  )
}

export const getServerSideProps = async () => {
  const query = '*[_type == "product"]'
  const products = await client.fetch(query)

  const bannerQuery = '*[_type == "banner"]'
  const bannerData = await client.fetch(bannerQuery)

  return {
    props: { products, bannerData }
  }
}
export default Home