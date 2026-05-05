import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Home from './pages/Home';
import AboutUs from './pages/Aboutus';
import Experiences from './pages/Experinces';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Services from './pages/Services';
import ContactUs from './pages/Contactus';
import Login from './pages/Login';
import Signup from './pages/signup'
import UserDashboard from './pages/UserDashboard';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Cafe from './pages/cafe';
import Books from './pages/Books';
import AdminDashboard from './pages/AdminDashboard';
import FAQ from './pages/FAQ';
import ShippingPolicy from './pages/ShippingPolicy';

import ProtectedRoute from './components/Protectedroute';
import HavenAIChat from './components/HavenAIChat';


const App = () => {
  return (
    <div>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#2d3a2d',
            color: '#fff',
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cafe" element={<Cafe />} />
        <Route path="/books" element={<Books />} />
        <Route path="/services" element={<Services />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
      <HavenAIChat />
    </div>
  );
};

export default App;