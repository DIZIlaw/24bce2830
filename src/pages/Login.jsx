import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login();
      navigate('/marketplace');
    } catch (error) {
      console.error("Auth error:", error);
      alert("Failed to sign in. Have you updated firebaseConfig.js with your valid keys?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white dark:bg-[#1a1a1a] p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Welcome back</h2>
          <p className="text-gray-500">Sign in with your VIT email to continue.</p>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium py-3.5 px-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 shadow-sm"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        <p className="mt-8 text-center text-xs text-gray-500">
          By signing in, you agree to our Terms of Service and Privacy Policy. Must be a verified student.
        </p>
      </motion.div>
    </div>
  );
}
