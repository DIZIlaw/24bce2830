import React from 'react';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';

export default function Wishlist() {
  const wishlistItems = [
    { id: 2, title: 'Engineering Mathematics by BS Grewal', price: 400, category: 'Books', description: '43rd Edition, intact pages.', location: 'Women\'s Hostel Block A', imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="mb-10 flex items-center gap-3">
        <div className="p-3 bg-red-50 text-red-500 rounded-xl">
          <Heart size={28} className="fill-current" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">Your Wishlist</h1>
          <p className="text-gray-500">Items you've saved for later.</p>
        </div>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map(product => (
            <div key={product.id} className="relative group">
               <ProductCard product={product} />
               <button className="absolute top-4 right-4 z-20 p-2 bg-white rounded-full shadow-md text-red-500 hover:scale-110 transition-transform">
                 <Heart size={20} className="fill-current" />
               </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-gray-800">
           <Heart size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
           <p className="text-lg text-gray-500 max-w-sm mx-auto">Your wishlist is empty. Start browsing the marketplace and save items you like!</p>
        </div>
      )}

    </div>
  );
}
