import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import FeaturedProducts from '../components/FeaturedProducts'
import FeaturesSection from '../components/FeaturesSection'
import HomeAbout from './Aboutus'
// Correcting footer import and spacing
import ProductsFooter from '../components/ProductsFooter'

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <FeaturedProducts />
      <FeaturesSection />
      <ProductsFooter />
    </div>
  )
}

export default Home
