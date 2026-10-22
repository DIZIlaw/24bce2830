import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, User, Clock, Heart, Share2, AlertCircle, MessageCircle, ShoppingBag, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ChatDrawer from '../components/ChatDrawer';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc, collection, addDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';

export default function ProductPage() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Order Form State
  const [orderName, setOrderName] = useState(currentUser?.name || '');
  const [orderHostel, setOrderHostel] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [orderMessage, setOrderMessage] = useState('');
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleOrderSubmit = async () => {
    if (!orderName || !orderHostel || !orderPhone) {
      alert("Please fill out your Name, Hostel, and Phone number.");
      return;
    }
    
    setOrdering(true);
    try {
      // 1. Create order document
      await addDoc(collection(db, 'orders'), {
        productId: product.id,
        productTitle: product.title,
        productPrice: product.price,
        productImageUrl: product.imageUrl,
        buyerId: currentUser.uid,
        buyerName: currentUser.name || 'User',
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        status: 'pending',
        buyerDetails: {
          name: orderName,
          hostel: orderHostel,
          phone: orderPhone,
          message: orderMessage
        },
        createdAt: serverTimestamp()
      });

      // 2. Increment request count on product
      const productRef = doc(db, 'products', product.id);
      await updateDoc(productRef, {
        requestCount: increment(1)
      });

      setPurchaseSuccess(true);
      setShowOrderForm(false);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-[60vh]"><Loader2 size={40} className="animate-spin text-primary-500 mb-4"/></div>;
  }

  if (notFound || !product) {
    return <div className="text-center py-20 text-gray-500">Product not found.</div>;
  }  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center text-sm text-gray-500 mb-8 gap-2">
        <Link to="/marketplace" className="hover:text-primary-500">Marketplace</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-300 font-medium">{product.category}</span>
        <span>/</span>
        <span className="truncate w-40 text-gray-400">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white dark:bg-[#1a1a1a] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
        
        {/* Left: Image gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden cursor-zoom-in">
            <img 
              src={product.imageUrl} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Thumbnails placeholder */}
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border-2 border-primary-500 opacity-100"><img src={product.imageUrl} alt="" className="w-full h-full object-cover" /></div>
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden opacity-50 hover:opacity-100 transition-opacity"><img src={product.imageUrl} alt="" className="w-full h-full object-cover" /></div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              {product.title}
            </h1>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-emerald-700">₹{product.price}</span>
              <div className="flex gap-3">
                <button className="p-3 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                  <Heart size={20} />
                </button>
                <button className="p-3 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="py-6 border-y border-gray-100 dark:border-gray-800 my-2">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">Description</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 py-6 text-sm mb-6">
            <div className="flex flex-col gap-2">
              <span className="text-gray-500 flex items-center gap-2"><MapPin size={16}/> Location</span>
              <span className="font-medium text-gray-900 dark:text-white">{product.location}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-gray-500 flex items-center gap-2"><User size={16}/> Seller</span>
              <span className="font-medium text-gray-900 dark:text-white">{product.sellerName}</span>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <span className="text-gray-500 flex items-center gap-2"><Clock size={16}/> Posted</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {product.createdAt ? product.createdAt.toDate().toLocaleDateString() : 'Recently'}
              </span>
            </div>
          </div>

          <div className="mt-auto space-y-4">
             {purchaseSuccess ? (
               <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 p-6 flex flex-col items-center justify-center text-center rounded-2xl border border-emerald-200 dark:border-emerald-800/30">
                 <CheckCircle size={40} className="mb-3 text-emerald-500" />
                 <h3 className="text-xl font-bold mb-1">Order Placed Successfully!</h3>
                 <p className="text-sm opacity-90">The seller has been notified. You can track this in your Orders page.</p>
               </div>
             ) : showOrderForm ? (
               <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Place Order Request</h3>
                  <div className="space-y-4">
                    <input type="text" value={orderName} onChange={e => setOrderName(e.target.value)} placeholder="Your Name" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white shadow-sm"/>
                    <input type="text" value={orderHostel} onChange={e => setOrderHostel(e.target.value)} placeholder="Hostel/Room No." className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white shadow-sm"/>
                    <input type="tel" value={orderPhone} onChange={e => setOrderPhone(e.target.value)} placeholder="Phone Number" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white shadow-sm"/>
                    <textarea value={orderMessage} onChange={e => setOrderMessage(e.target.value)} placeholder="Message to seller (Optional)..." rows="3" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white shadow-sm resize-none"></textarea>
                    <div className="flex gap-3">
                      <button onClick={() => setShowOrderForm(false)} disabled={ordering} className="px-6 py-3 rounded-xl font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors w-1/3">Cancel</button>
                      <button onClick={handleOrderSubmit} disabled={ordering} className="px-6 py-3 rounded-xl font-medium text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 transition-colors flex-1 shadow-lg disabled:opacity-70 flex items-center justify-center gap-2">
                        {ordering && <Loader2 size={18} className="animate-spin" />}
                        {ordering ? 'Placing...' : 'Confirm Request'}
                      </button>
                    </div>
                  </div>
               </div>
             ) : (
                <div className="flex gap-4">
                  <button onClick={() => {
                    if(!currentUser) { alert('Please login first!'); return;}
                    setShowOrderForm(true);
                  }} className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary-600 dark:bg-primary-500 text-white rounded-xl font-semibold text-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-all shadow-lg hover:shadow-primary-500/30">
                    <ShoppingBag size={22} />
                    <span>Buy Now</span>
                  </button>
                  <button onClick={() => {
                    if(!currentUser) { alert('Please login first!'); return;}
                    setChatOpen(true);
                  }} className="flex-1 flex items-center justify-center gap-2 py-4 bg-white dark:bg-[#1a1a1a] border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm group">
                    <MessageCircle size={22} className="group-hover:text-primary-500 transition-colors" />
                    <span>Live Negotiate</span>
                  </button>
                </div>
             )}
          </div>

          <div className="mt-6 flex items-start gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl text-sm">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>Ensure you meet the seller in a public place inside the campus. Do not transfer money before checking the item. Never share OTPs.</p>
          </div>

        </div>
      </div>

      {/* The Killer Feature: Animated Chat Slide-over */}
      <ChatDrawer 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)} 
        sellerName={product.sellerName}
        productTitle={product.title}
      />
    </div>
  );
}
