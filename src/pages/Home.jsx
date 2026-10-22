import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Laptop, BookOpen, Sofa, Bike, Shirt, Headphones } from 'lucide-react';

const categoryIcons = {
  'Electronics': <Laptop size={32} />,
  'Books': <BookOpen size={32} />,
  'Furniture': <Sofa size={32} />,
  'Cycles': <Bike size={32} />,
  'Clothing': <Shirt size={32} />,
  'Accessories': <Headphones size={32} />
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-32 sm:pt-32 sm:pb-40 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        {/* Abstract Fluid Animated Gradients */}
        <div className="absolute top-0 inset-x-0 h-full w-full overflow-hidden -z-10 pointer-events-none bg-white dark:bg-[#121212]">
          <div className="gradient-blob gradient-blob-1"></div>
          <div className="gradient-blob gradient-blob-2"></div>
          <div className="gradient-blob gradient-blob-3"></div>
          {/* Noise overlay for texture */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          <span className="inline-block py-1 px-4 rounded-full bg-primary-50 text-primary-600 font-semibold tracking-wider text-sm mb-6 border border-primary-100">
            EXCLUSIVE TO VIT STUDENTS
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
            The marketplace for <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-blue-600">your campus life.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Buy, sell, and discover items from students right on campus. Safe, fast, and entirely within the VIT community.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/marketplace" className="w-full sm:w-auto px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium text-lg hover:scale-105 transition-transform shadow-xl shadow-black/10">
              Browse Items
            </Link>
            <Link to="/sell" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 text-black dark:text-white rounded-full font-medium text-lg border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform shadow-lg">
              Start Selling
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white dark:bg-[#181818]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Popular Categories</h2>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-6 gap-6"
          >
            {['Electronics', 'Books', 'Furniture', 'Cycles', 'Clothing', 'Accessories'].map((cat, i) => (
              <motion.div 
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group cursor-pointer flex flex-col"
              >
                <div className="aspect-square bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl mb-4 flex items-center justify-center group-hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.2)] transition-all border border-gray-100/50 dark:border-gray-700/50 relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/10 group-hover:to-transparent transition-colors duration-500"></div>
                   <div className="text-gray-400 group-hover:text-primary-500 transition-colors z-10">
                     {categoryIcons[cat]}
                   </div>
                </div>
                <h3 className="text-center font-medium text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{cat}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
    </div>
  );
}
