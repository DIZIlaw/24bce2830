import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal, Loader2 } from 'lucide-react';
import { db } from '../firebase/firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'products'), where('status', '==', 'available'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
      // Sort newest first
      items.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      setProducts(items);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const categories = ['All', 'Electronics', 'Books', 'Cycles', 'Furniture', 'Clothing', 'Accessories'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'All' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Marketplace</h1>
           <p className="text-gray-500">Discover items from other VITians.</p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80 pl-11 pr-4 py-3 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm text-gray-900 dark:text-white"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-5 py-3 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 shadow-sm">
             <SlidersHorizontal size={20} />
             <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto pb-4 mb-8 gap-3 no-scrollbar">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full font-medium transition-all ${
              category === c 
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-md' 
                : 'bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Loader2 size={40} className="animate-spin mb-4 text-primary-500" />
          <p>Loading items from campus...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 mb-4">
            <Search size={30} />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No items found</h3>
          <p className="text-gray-500">Try adjusting your search or category filter.</p>
        </div>
      )}
      
    </div>
  );
}
