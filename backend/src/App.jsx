import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Aboutus from './pages/Aboutus'
import Experinces from './pages/Experinces'
import AboutUs from './pages/Aboutus'
import Navbar from './components/Navbar'
import Products from './pages/Products'
import Services from './pages/Services'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Contactus from './pages/Contactus'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/products" element={<Products />} />
        <Route path="/services" element={<Services/>} />
        <Route path="/experiences" element={<Experinces />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/contactus" element={<Contactus />} />
      </Routes>
    </div>
  )
}

export default App
