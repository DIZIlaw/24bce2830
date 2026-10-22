import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Marketplace from './pages/Marketplace';
import ProductPage from './pages/ProductPage';
import SellItem from './pages/SellItem';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-300">
        <Navbar />
        <main className="flex-grow pt-20 pb-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/sell" element={<SellItem />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
