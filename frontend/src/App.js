import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetails from './pages/ProductDetails';
import NotFound from './pages/NotFound';
import AddNewProduct from './pages/AddNewProduct';
import Login from './pages/Login';
import './App.css';
import AuthProvider from './context/AuthProvider';

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

const App = () => {

  return (
    <div className='main-container'>
    <Router>
       <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
        <Route path="/checkout" element={<ProtectedRoute element={<Checkout />} />} />
        <Route path="/product/:id" element={<ProtectedRoute element={<ProductDetails />} />} />
        <Route path="/newProduct" element={<ProtectedRoute element={<AddNewProduct />} />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      </AuthProvider>
    </Router>
    </div>
  );
};

export default App;