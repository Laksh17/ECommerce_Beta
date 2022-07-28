import React, { useState, useEffect } from "react";
import { client } from "../lib/client";
import { Product, FooterBanner, HeroBanner } from "../components";
import { useWeb3 } from "../context/StateContext";

const Home = ({ products, bannerData }) => {
  const { web3, provider } = useWeb3();
  const [account, setAccount] = useState(null);

  provider && provider.on("accountsChanged", () => window.location.reload());

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    };
    web3 && getAccount();
  }, [web3]);

  return (
    <div>
      <HeroBanner heroBanner={bannerData.length && bannerData[0]} />
      <div className="products-heading">
        <h2>Best Selling Products</h2>
        <p>Speakers that please one and all!</p>
      </div>
      {account}
      <div className="products-container">
        {products?.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
      <FooterBanner footerBanner={bannerData && bannerData[0]} />
    </div>
  );
};

export const getServerSideProps = async () => {
  const query = '*[_type == "product"]';
  const products = await client.fetch(query);

  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);

  return {
    props: { products, bannerData },
  };
};
export default Home;
