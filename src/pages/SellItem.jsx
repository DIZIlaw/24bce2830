import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Image as ImageIcon, X, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function SellItem() {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const { currentUser } = useAuth();
  const [imageFile, setImageFile] = useState(null);

  // Form state
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith('image/')) return;
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiscard = () => {
    setTitle('');
    setPrice('');
    setCategory('');
    setLocation('');
    setDescription('');
    setImagePreview(null);
    setImageFile(null);
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 800;
          
          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7)); // compresses to ~100kb
        };
      };
    });
  };

  const handlePostListing = async () => {
    if (!currentUser) { alert('You must be logged in to post an item.'); return; }
    // Validation
    if (!imageFile) { alert('Please upload a valid photo.'); return; }
    if (!title.trim()) { alert('Please enter an item title.'); return; }
    if (!price || Number(price) <= 0) { alert('Please enter a valid price.'); return; }
    if (!category || category === 'Select a category') { alert('Please select a category.'); return; }
    if (!location.trim()) { alert('Please enter a pickup location.'); return; }

    setPosting(true);
    
    try {
      // 1. Process Image locally (Bypass Firebase Storage entirely)
      console.log("Compressing image...");
      const imageUrl = await compressImage(imageFile);
      console.log("Image compressed! Base64 size: " + Math.round(imageUrl.length / 1024) + " KB");

      // 2. Save to Firestore
      console.log("Saving listing data to Firestore...");
      const dbPromise = addDoc(collection(db, 'products'), {
        title,
        price: Number(price),
        category,
        location,
        description,
        sellerId: currentUser.uid,
        sellerName: currentUser.name || 'User',
        imageUrl,
        status: 'available',
        requestCount: 0,
        createdAt: serverTimestamp()
      });
      const dbTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Firestore Database took too long to respond. Please make sure the Firestore Database is initialized and rules are set to public.")), 10000)
      );

      await Promise.race([dbPromise, dbTimeoutPromise]);
      console.log("Saved to Firestore successfully!");

      setPosting(false);
      setPosted(true);
      
    } catch (error) {
      console.error("Error posting listing: ", error);
      alert(`Failed to post: ${error.message}`);
      setPosting(false);
    }
  };

  if (posted) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-white dark:bg-[#1a1a1a] shadow-xl border border-gray-100 dark:border-gray-800 rounded-3xl p-12 text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-900/20 mb-6">
            <CheckCircle size={44} className="text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">Listing Posted!</h2>
          <p className="text-gray-500 mb-2 text-lg">Your item "<span className="font-medium text-gray-900 dark:text-white">{title}</span>" is now live on the marketplace.</p>
          <p className="text-gray-400 text-sm mb-8">Buyers will be able to see and purchase your item right away.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/marketplace')}
              className="px-8 py-3 rounded-xl font-semibold text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 transition-all shadow-lg"
            >
              View Marketplace
            </button>
            <button
              onClick={() => { setPosted(false); handleDiscard(); }}
              className="px-8 py-3 rounded-xl font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Post Another Item
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Post an Item for Sale</h1>
        <p className="text-gray-500">Provide details about your item to help buyers find it.</p>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] shadow-xl border border-gray-100 dark:border-gray-800 rounded-3xl p-8">
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">Item Images</label>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            {imagePreview ? (
              <div className="relative w-full sm:w-64 aspect-square rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 shadow-sm">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 text-white hover:bg-black/80 rounded-full backdrop-blur-md transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-colors ${dragActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
              >
                <div className="p-4 bg-white dark:bg-gray-700 rounded-full shadow-sm mb-4">
                  <UploadCloud size={30} className="text-primary-500" />
                </div>
                <p className="font-medium text-gray-900 dark:text-white mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Item Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Engineering Drawing Kit" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Price (₹)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="500" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none cursor-pointer">
                <option value="">Select a category</option>
                <option value="Electronics">Electronics</option>
                <option value="Books">Books</option>
                <option value="Cycles">Cycles</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Pickup Location (in Campus)</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Men's Hostel Block C, Main Gate" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Description</label>
              <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the condition, age, and any other details buyers might want to know..." className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"></textarea>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-4">
            <button type="button" onClick={handleDiscard} className="px-6 py-3 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Discard</button>
            <button type="button" onClick={handlePostListing} disabled={posting} className="px-8 py-3 rounded-xl font-semibold text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
              {posting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <span>Post Listing</span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
