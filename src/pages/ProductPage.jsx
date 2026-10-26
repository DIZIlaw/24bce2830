import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, User, Clock, Heart, Share2, AlertCircle, MessageCircle, ShoppingBag, CheckCircle, Loader2, CreditCard, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ChatDrawer from '../components/ChatDrawer';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc, collection, addDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { RAZORPAY_KEY_ID, loadRazorpayScript } from '../utils/razorpay';

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
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' | 'cash'
  const [ordering, setOrdering] = useState(false);
  const [completedOrderMeta, setCompletedOrderMeta] = useState(null);

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

  const finalizeOrder = async (meta = {}) => {
    setOrdering(true);

    const safeOrder = {
      productId: product?.id || 'sample_item',
      productTitle: product?.title || 'Campus Item',
      productPrice: Number(product?.price) || 0,
      productImageUrl: product?.imageUrl || '',
      buyerId: currentUser?.uid || ('guest_' + Date.now()),
      buyerName: orderName || currentUser?.name || 'VITian Buyer',
      sellerId: product?.sellerId || 'campus_seller',
      sellerName: product?.sellerName || 'VIT Seller',
      status: meta.status || 'pending',
      paymentMethod: meta.paymentMethod || (paymentMethod === 'razorpay' ? 'Razorpay' : 'Cash on Handoff'),
      paymentStatus: meta.paymentStatus || (paymentMethod === 'razorpay' ? 'Paid' : 'Pending'),
      razorpayPaymentId: meta.razorpayPaymentId || null,
      buyerDetails: {
        name: orderName,
        hostel: orderHostel,
        phone: orderPhone,
        message: orderMessage || ''
      }
    };

    let placed = false;

    // 1. Try to record order in Firestore database
    try {
      await addDoc(collection(db, 'orders'), {
        ...safeOrder,
        createdAt: serverTimestamp()
      });
      placed = true;

      // Increment request counter safely
      try {
        if (product?.id) {
          const productRef = doc(db, 'products', product.id);
          await updateDoc(productRef, {
            requestCount: increment(1)
          });
        }
      } catch (countErr) {
        console.warn("Product count update skipped:", countErr);
      }
    } catch (firestoreError) {
      console.warn("Firestore write unavailable or restricted, using local storage fallback:", firestoreError);
    }

    // 2. Always persist locally so it immediately shows in Orders tab
    try {
      const localOrder = {
        id: 'ord_' + Date.now(),
        ...safeOrder,
        createdAt: new Date().toISOString()
      };
      const existing = JSON.parse(localStorage.getItem('vit_campus_orders') || '[]');
      existing.unshift(localOrder);
      localStorage.setItem('vit_campus_orders', JSON.stringify(existing));
      placed = true;
    } catch (storageError) {
      console.error("Local storage error:", storageError);
    }

    setOrdering(false);

    if (placed) {
      setCompletedOrderMeta(safeOrder);
      setPurchaseSuccess(true);
      setShowOrderForm(false);
    } else {
      alert("Failed to place order. Please try again.");
    }
  };

  const handleRazorpayPayment = async () => {
    setOrdering(true);
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded || !window.Razorpay) {
      alert("Razorpay checkout is currently unavailable. Please verify your connection.");
      setOrdering(false);
      return;
    }

    const price = Number(product?.price) || 0;
    const amountInPaise = Math.round(price * 100);

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: amountInPaise,
      currency: "INR",
      name: "VIT Campus Marketplace",
      description: `Payment for ${product?.title || 'Campus Item'}`,
      image: product?.imageUrl || undefined,
      prefill: {
        name: orderName,
        email: currentUser?.email || "student@vitstudent.ac.in",
        contact: orderPhone || "9999999999"
      },
      notes: {
        productId: product?.id || '',
        productTitle: product?.title || '',
        hostel: orderHostel,
        seller: product?.sellerName || ''
      },
      theme: {
        color: "#059669"
      },
      handler: async function (response) {
        await finalizeOrder({
          paymentMethod: 'Razorpay',
          paymentStatus: 'Paid',
          razorpayPaymentId: response.razorpay_payment_id,
          status: 'approved'
        });
      },
      modal: {
        ondismiss: function () {
          setOrdering(false);
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert("Payment Failed: " + (response.error?.description || "Payment cancelled or declined"));
        setOrdering(false);
      });
      rzp.open();
    } catch (err) {
      console.error("Razorpay open error:", err);
      alert("Error opening Razorpay checkout. Please try again.");
      setOrdering(false);
    }
  };

  const handleOrderSubmit = async () => {
    if (!orderName || !orderHostel || !orderPhone) {
      alert("Please fill out your Name, Hostel, and Phone number.");
      return;
    }

    if (paymentMethod === 'razorpay') {
      await handleRazorpayPayment();
    } else {
      await finalizeOrder({
        paymentMethod: 'Cash on Handoff',
        paymentStatus: 'Pending',
        status: 'pending'
      });
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
               <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 p-6 flex flex-col items-center justify-center text-center rounded-2xl border border-emerald-200 dark:border-emerald-800">
                 <CheckCircle size={44} className="mb-3 text-emerald-500" />
                 <h3 className="text-xl font-bold mb-1">
                   {completedOrderMeta?.paymentMethod === 'Razorpay' ? 'Payment & Order Placed!' : 'Order Placed Successfully!'}
                 </h3>
                 <p className="text-sm opacity-90 mb-3">
                   {completedOrderMeta?.paymentMethod === 'Razorpay'
                     ? `Paid ₹${product.price} via Razorpay Test Gateway.`
                     : 'The seller has been notified for campus handoff.'}
                 </p>
                 {completedOrderMeta?.razorpayPaymentId && (
                   <div className="bg-white/80 dark:bg-black/40 px-3.5 py-1.5 rounded-lg text-xs font-mono mb-4 border border-emerald-200 dark:border-emerald-800">
                     Razorpay Payment ID: <span className="font-bold text-emerald-700 dark:text-emerald-300">{completedOrderMeta.razorpayPaymentId}</span>
                   </div>
                 )}
                 <Link to="/orders" className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-md">
                   View in Orders
                 </Link>
               </div>
             ) : showOrderForm ? (
               <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white">Place Order Request</h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800">
                      ⚡ Razorpay Test Active
                    </span>
                  </div>
                  <div className="space-y-4">
                    <input type="text" value={orderName} onChange={e => setOrderName(e.target.value)} placeholder="Your Name" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white shadow-sm"/>
                    <input type="text" value={orderHostel} onChange={e => setOrderHostel(e.target.value)} placeholder="Hostel / Room No. (e.g. Block A 304)" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white shadow-sm"/>
                    <input type="tel" value={orderPhone} onChange={e => setOrderPhone(e.target.value)} placeholder="Phone Number" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white shadow-sm"/>
                    <textarea value={orderMessage} onChange={e => setOrderMessage(e.target.value)} placeholder="Message to seller (Optional)..." rows="2" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white shadow-sm resize-none"></textarea>

                    {/* Payment Options */}
                    <div className="pt-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Payment Method</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('razorpay')}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                            paymentMethod === 'razorpay'
                              ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${paymentMethod === 'razorpay' ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
                            <CreditCard size={18} />
                          </div>
                          <div>
                            <div className="text-sm font-bold flex items-center gap-1.5">
                              Razorpay
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100">TEST</span>
                            </div>
                            <div className="text-xs opacity-75">UPI, Cards, NetBanking</div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('cash')}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                            paymentMethod === 'cash'
                              ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${paymentMethod === 'cash' ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
                            <ShoppingBag size={18} />
                          </div>
                          <div>
                            <div className="text-sm font-bold">Cash on Handoff</div>
                            <div className="text-xs opacity-75">Pay in person at VIT</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button onClick={() => setShowOrderForm(false)} disabled={ordering} className="px-5 py-3 rounded-xl font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 transition-colors w-1/3">Cancel</button>
                      <button onClick={handleOrderSubmit} disabled={ordering} className="px-6 py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex-1 shadow-lg disabled:opacity-70 flex items-center justify-center gap-2">
                        {ordering ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : paymentMethod === 'razorpay' ? (
                          <>
                            <ShieldCheck size={18} />
                            <span>Pay ₹{product.price} with Razorpay</span>
                          </>
                        ) : (
                          <span>Place Request (₹{product.price})</span>
                        )}
                      </button>
                    </div>
                  </div>
               </div>
             ) : (
                <div className="flex gap-4">
                  <button onClick={() => {
                    setShowOrderForm(true);
                  }} className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary-600 dark:bg-primary-500 text-white rounded-xl font-semibold text-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-all shadow-lg hover:shadow-primary-500/30">
                    <ShoppingBag size={22} />
                    <span>Buy Now</span>
                  </button>
                  <button onClick={() => {
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
