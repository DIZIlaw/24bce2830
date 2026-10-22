import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Camera, LayoutList, Eye, Trash2, Edit, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { db } from '../firebase/firebaseConfig';
import { collection, query, where, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    
    const q = query(
      collection(db, 'products'),
      where('sellerId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
      items.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      setMyItems(items);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching my items:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (error) {
        console.error("Error deleting document: ", error);
        alert("Failed to delete listing.");
      }
    }
  };

  const handleEditProfile = async () => {
    const newName = prompt("Enter your new Display Name:", currentUser?.name);
    if (newName && newName.trim() !== '' && newName !== currentUser?.name) {
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          name: newName.trim()
        });
        alert("Profile name updated successfully! Please log out and back in to see the changes everywhere.");
        window.location.reload(); // Quick refresh to pull new auth if possible
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile name.");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Details Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm text-center">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 mx-auto border-4 border-white dark:border-[#1a1a1a] shadow-lg">
                 <img src={currentUser?.photoURL || `https://ui-avatars.com/api/?name=${currentUser?.name || 'VIT Student'}&background=10b981&color=fff&size=200`} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <button className="absolute bottom-1 right-1 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md text-gray-600 hover:text-black transition-colors border border-gray-100 dark:border-gray-700">
                 <Camera size={18} />
              </button>
            </div>
            
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">{currentUser?.name || 'Alexander Doe'}</h2>
            <div className="flex items-center justify-center gap-1 text-gray-500 mb-6">
              <Shield size={14} className="text-emerald-500" />
              <span className="text-sm font-medium">Verified Student</span>
            </div>

            <div className="space-y-4 text-left border-t border-gray-100 dark:border-gray-800 pt-6">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Mail size={18} />
                <span className="text-sm">{currentUser?.email || 'alex.doe2023@vitstudent.ac.in'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <User size={18} />
                <span className="text-sm">Joined Sep 2023</span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
               <button onClick={handleEditProfile} className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                 Edit Profile
               </button>
               <button onClick={() => navigate('/orders')} className="w-full py-3 px-4 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center gap-2 rounded-xl font-medium border border-primary-100 dark:border-primary-800 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors">
                 <Inbox size={18} />
                 <span>View Order History</span>
               </button>
               <button onClick={logout} className="w-full py-3 px-4 bg-red-50 text-red-600 dark:bg-red-900/10 dark:text-red-400 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
                 Log Out
               </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2">
           <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm min-h-full">
              <div className="flex items-center gap-2 mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">
                 <LayoutList size={24} className="text-primary-500"/>
                 <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Active Listings</h2>
              </div>

              {loading ? (
                <div className="py-10 text-center text-gray-500">Loading your listings...</div>
              ) : myItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {myItems.map(item => (
                    <div key={item.id} className="relative group">
                      <ProductCard product={item} />
                      
                      <div className="absolute top-2 left-2 px-3 py-1.5 bg-black/80 backdrop-blur text-sm font-medium rounded-lg text-white shadow-sm flex items-center gap-1.5">
                        <Eye size={16} />
                        <span>{item.requestCount || 0} requests</span>
                      </div>
                      
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-white/90 backdrop-blur rounded-lg text-gray-700 shadow-sm border border-gray-100 hover:text-primary-500 transition-colors">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 bg-white/90 backdrop-blur text-red-600 rounded-lg shadow-sm border border-gray-100 hover:bg-red-50 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-500 mb-4">You haven't posted any items yet.</p>
                  <Link to="/sell" className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium inline-block">Post an Item</Link>
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
}
