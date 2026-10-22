import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Heart, Laptop, BookOpen, Sofa, Bike, Shirt, Headphones, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

const getCategoryIcon = (category) => {
  switch(category) {
    case 'Electronics': return <Laptop size={14} />;
    case 'Books': return <BookOpen size={14} />;
    case 'Furniture': return <Sofa size={14} />;
    case 'Cycles': return <Bike size={14} />;
    case 'Clothing': return <Shirt size={14} />;
    case 'Accessories': return <Headphones size={14} />;
    default: return null;
  }
};

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  
  const handleQuickBuy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    alert('Order Placed Successfully! The seller has been notified and you can view this in your Orders page.');
    // In a real app we would route to a success / checkout page or trigger an API call.
  };
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img 
          src={product.imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400'} 
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Overlay Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button className="p-2 bg-white/70 backdrop-blur-md rounded-full text-gray-600 hover:text-red-500 hover:bg-white transition-colors duration-200 shadow-sm" onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert("Added to wishlist!"); }}>
            <Heart size={18} />
          </button>
        </div>
        
        {/* Quick Buy Button (Appears on Hover) */}
        <div className="absolute bottom-3 left-3 right-3 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button onClick={handleQuickBuy} className="w-full flex items-center justify-center gap-2 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform">
            <ShoppingCart size={16} /> 
            <span>Quick Buy</span>
          </button>
        </div>
        
        {/* Subtle gradient overlay at bottom for text contrast if needed */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </Link>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-primary-500 transition-colors">
              {product.title}
            </h3>
          </Link>
          <span className="font-bold text-lg text-gray-900 dark:text-white">₹{product.price}</span>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 dark:border-gray-800/80">
           <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-1">
             <MapPin size={14} className="text-gray-400" />
             <span className="truncate max-w-[100px]">{product.location}</span>
           </div>
           <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-md">
             {getCategoryIcon(product.category)}
             {product.category}
           </span>
        </div>
      </div>
    </motion.div>
  );
}
