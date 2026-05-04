import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import FeaturesSection from '../components/FeaturesSection'
import HomeAbout from './Aboutus'
// Correcting footer import and spacing
import ProductsFooter from '../components/ProductsFooter'

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <FeaturesSection />
      <ProductsFooter />
    </div>
  )
}

export default Home
