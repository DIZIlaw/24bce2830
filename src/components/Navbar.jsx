import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Heart, PlusCircle, Search, Menu, X, LogIn, Inbox, Code2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import DeveloperModal from './DeveloperModal';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleOpenModal = () => setIsDevModalOpen(true);
    window.addEventListener('open-developer-modal', handleOpenModal);
    return () => window.removeEventListener('open-developer-modal', handleOpenModal);
  }, []);

  const navLinks = [
    { name: 'Marketplace', path: '/marketplace' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary-500 text-white p-2 rounded-xl group-hover:scale-105 transition-transform shadow-lg shadow-emerald-500/30">
              <ShoppingBag size={24} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block dark:text-white">
              VIT Campus
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} className={`hover:text-primary-500 transition-colors ${location.pathname === link.path ? 'text-primary-500' : ''}`}>
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Developer Detail Button */}
            <button
              onClick={() => setIsDevModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all shadow-sm hover:scale-105 active:scale-95"
              title="Project & Developer Details"
            >
              <Code2 size={13} className="text-emerald-600 dark:text-emerald-400" />
              <span>Developer Details</span>
            </button>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

            <div className="flex items-center gap-4">
              <Link to="/marketplace" className="text-gray-500 hover:text-primary-500 transition-colors">
                <Search size={20} />
              </Link>
              
              {currentUser ? (
                <>
                  <Link to="/wishlist" className="text-gray-500 hover:text-red-500 transition-colors">
                    <Heart size={20} />
                  </Link>
                  <Link to="/orders" className="text-gray-500 hover:text-primary-500 transition-colors">
                    <Inbox size={20} />
                  </Link>
                  <Link to="/profile" className="text-gray-500 hover:text-primary-500 transition-colors">
                    <User size={20} />
                  </Link>
                  <Link to="/sell" className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-5 py-2 rounded-full font-medium hover:scale-105 transition-transform shadow-lg">
                    <PlusCircle size={18} />
                    <span>Sell</span>
                  </Link>
                </>
              ) : (
                <Link to="/login" className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                  <LogIn size={18} />
                  <span>Log In</span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600 focus:outline-none">
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-gray-100 dark:border-gray-800"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 dark:text-gray-200 hover:text-primary-500 hover:bg-gray-50 dark:hover:bg-gray-800">
                  {link.name}
                </Link>
              ))}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsDevModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
              >
                <Code2 size={16} />
                <span>Developer Details (24BIT0606)</span>
              </button>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-4"></div>
              {currentUser ? (
                <>
                  <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:text-primary-500">Wishlist</Link>
                  <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:text-primary-500">Orders</Link>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:text-primary-500">Profile</Link>
                  <Link to="/sell" onClick={() => setMobileMenuOpen(false)} className="mt-4 flex items-center justify-center gap-2 bg-primary-500 text-white px-4 py-3 rounded-xl font-medium w-full">
                    <PlusCircle size={20} />
                    <span>Sell an Item</span>
                  </Link>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-medium mt-4">
                  Log In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Developer Details Modal */}
      <DeveloperModal isOpen={isDevModalOpen} onClose={() => setIsDevModalOpen(false)} />
    </nav>
  );
}
