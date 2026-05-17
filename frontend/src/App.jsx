import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Loader from './components/Loader';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const AboutUs = lazy(() => import('./pages/Aboutus'));
const Experiences = lazy(() => import('./pages/Experinces'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Services = lazy(() => import('./pages/Services'));
const ContactUs = lazy(() => import('./pages/Contactus'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const Profile = lazy(() => import('./pages/Profile'));
const Cart = lazy(() => import('./pages/Cart'));
const Cafe = lazy(() => import('./pages/cafe'));
const Books = lazy(() => import('./pages/Books'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const FAQ = lazy(() => import('./pages/FAQ'));
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const Customization = lazy(() => import('./pages/Customization'));

const ProtectedRoute = lazy(() => import('./components/Protectedroute'));
const HavenAIChat = lazy(() => import('./components/HavenAIChat'));

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

      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cafe" element={<Cafe />} />
          <Route path="/cafe/:id" element={<Cafe />} />
          <Route path="/books" element={<Books />} />
          <Route path="/services" element={<Services />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/customization" element={<Customization />} />

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
      </Suspense>
      <HavenAIChat />
    </div>
  );
};

export default App;