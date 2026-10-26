import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#121212] border-t border-gray-100 dark:border-gray-800 py-12 text-sm text-gray-500 z-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4">VIT Campus</h3>
            <p className="mb-4">The exclusive marketplace for VIT students to buy and sell securely.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Marketplace</h4>
            <ul className="space-y-2">
              <li><Link to="/marketplace" className="hover:text-black dark:hover:text-white transition-colors">Browse</Link></li>
              <li><Link to="/sell" className="hover:text-black dark:hover:text-white transition-colors">Sell an Item</Link></li>
              <li><Link to="/marketplace?category=Electronics" className="hover:text-black dark:hover:text-white transition-colors">Electronics</Link></li>
              <li><Link to="/marketplace?category=Books" className="hover:text-black dark:hover:text-white transition-colors">Books</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Safety Guidelines</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Account</h4>
            <ul className="space-y-2">
              <li><Link to="/profile" className="hover:text-black dark:hover:text-white transition-colors">Profile</Link></li>
              <li><Link to="/orders" className="hover:text-black dark:hover:text-white transition-colors">Orders</Link></li>
              <li><Link to="/wishlist" className="hover:text-black dark:hover:text-white transition-colors">Wishlist</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs gap-4">
          <p>© {new Date().getFullYear()} VIT Campus Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-developer-modal'))}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors border border-emerald-200/50 dark:border-emerald-800/40"
            >
              👨‍💻 Developer & Project Details (24BIT0606)
            </button>
            <span>Made for VITians 🚀</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
