import React, { useState, useEffect } from 'react';
import { Package, Inbox, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firebaseConfig';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';

export default function Orders() {
  const [tab, setTab] = useState('incoming');
  const { currentUser } = useAuth();
  
  const [incomingOrders, setIncomingOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    // Fetch Incoming Requests
    const qIncoming = query(collection(db, 'orders'), where('sellerId', '==', currentUser.uid));
    const unsubIncoming = onSnapshot(qIncoming, (snapshot) => {
      const items = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
      items.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      setIncomingOrders(items);
    });

    // Fetch My Orders
    const qMyOrders = query(collection(db, 'orders'), where('buyerId', '==', currentUser.uid));
    const unsubMyOrders = onSnapshot(qMyOrders, (snapshot) => {
      const items = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
      items.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      setMyOrders(items);
      setLoading(false);
    });

    return () => {
      unsubIncoming();
      unsubMyOrders();
    };
  }, [currentUser]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update status");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Orders</h1>
          <p className="text-gray-500">Manage your purchases and incoming requests.</p>
        </div>
        
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-full md:w-auto self-start">
          <button 
            className={`flex-1 md:flex-initial px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === 'incoming' ? 'bg-white dark:bg-[#1a1a1a] shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setTab('incoming')}
          >
            Incoming Requests
          </button>
          <button 
            className={`flex-1 md:flex-initial px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === 'my_orders' ? 'bg-white dark:bg-[#1a1a1a] shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setTab('my_orders')}
          >
            My Orders
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden">
        {tab === 'incoming' ? (
          <div>
            {loading ? (
              <div className="py-20 flex justify-center"><Loader2 size={30} className="animate-spin text-primary-500"/></div>
            ) : incomingOrders.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {incomingOrders.map(order => (
                  <div key={order.id} className="p-6 sm:p-8 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                           <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                             order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                             order.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                             order.status === 'completed' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' :
                             'bg-red-100 text-red-800'
                           }`}>
                             {order.status === 'pending' ? 'Pending Response' : 
                              order.status === 'approved' ? 'Approved' : 
                              order.status === 'completed' ? 'Order Closed' : 'Declined'}
                           </span>
                           <span className="text-sm text-gray-400">{order.createdAt ? order.createdAt.toDate().toLocaleDateString() : 'Recently'}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{order.productTitle}</h3>
                        <div className="space-y-1 text-sm bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                          <p><span className="text-gray-500">Buyer:</span> {order.buyerDetails?.name}</p>
                          <p><span className="text-gray-500">Phone:</span> {order.buyerDetails?.phone}</p>
                          <p><span className="text-gray-500">Deliver to:</span> <span className="font-medium text-gray-900 dark:text-gray-200">{order.buyerDetails?.hostel}</span></p>
                          {order.buyerDetails?.message && (
                            <p className="mt-2 text-gray-600 italic">"{order.buyerDetails.message}"</p>
                          )}
                        </div>
                      </div>
                      <div className="flex sm:flex-col gap-3 justify-center sm:justify-start shrink-0 min-w-[140px]">
                        {order.status === 'pending' && (
                          <>
                            <button onClick={() => handleUpdateStatus(order.id, 'approved')} className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium shadow-md hover:bg-gray-800 transition-colors">Accept</button>
                            <button onClick={() => handleUpdateStatus(order.id, 'declined')} className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-200 transition-colors">Decline</button>
                          </>
                        )}
                        {order.status === 'approved' && (
                          <div className="flex flex-col gap-2">
                             <div className="text-center p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Accepted</span>
                             </div>
                             <button onClick={() => handleUpdateStatus(order.id, 'completed')} className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium shadow-md hover:bg-gray-800 transition-colors w-full sm:w-auto">Close Order</button>
                          </div>
                        )}
                        {order.status === 'completed' && (
                          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                             <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Order Closed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
               <div className="py-20 text-center text-gray-500 flex flex-col items-center">
                 <Inbox size={48} className="mb-4 text-gray-300 dark:text-gray-700" />
                 <p>No incoming requests yet.</p>
               </div>
            )}
          </div>
        ) : (
          <div>
             {loading ? (
              <div className="py-20 flex justify-center"><Loader2 size={30} className="animate-spin text-primary-500"/></div>
             ) : myOrders.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {myOrders.map(order => (
                  <div key={order.id} className="p-6 sm:p-8 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                           <span className={`text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 ${
                             order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                             order.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                             order.status === 'completed' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' :
                             'bg-red-100 text-red-800'
                           }`}>
                             {order.status === 'approved' && <CheckCircle size={12}/>}
                             {order.status === 'completed' ? 'Order Closed' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                           </span>
                           <span className="text-sm text-gray-400">{order.createdAt ? order.createdAt.toDate().toLocaleDateString() : 'Recently'}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{order.productTitle}</h3>
                        <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-emerald-700 mb-4">₹{order.productPrice}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Seller: <span className="font-medium text-gray-900 dark:text-white">{order.sellerName}</span></p>
                      </div>
                      <div className="flex items-center sm:items-start shrink-0">
                         <button className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-medium border border-gray-200 dark:border-gray-700 shadow-sm w-full sm:w-auto">Contact Seller</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
               <div className="py-20 text-center text-gray-500 flex flex-col items-center">
                 <Package size={48} className="mb-4 text-gray-300 dark:text-gray-700" />
                 <p>You haven't placed any orders yet.</p>
               </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
