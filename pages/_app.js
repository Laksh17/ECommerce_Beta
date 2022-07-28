import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Layout } from '../components'
import '../styles/globals.css'
import { StateContext } from '../context/StateContext'


function MyApp({ Component, pageProps }) {
  return (
    //Pass the data from context to every component
    // <Web3Provider>
    <StateContext> 
      <Layout>
        <Toaster />
        <Component {...pageProps} /></Layout>
    </StateContext> 
    // </Web3Provider>
  ) // Wrapping the component like details page/ product page etc with the layout component and this integrates the layout


}

export default MyApp
