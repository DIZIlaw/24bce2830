import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ShieldCheck, MoreHorizontal } from 'lucide-react';

export default function ChatDrawer({ isOpen, onClose, sellerName, productTitle }) {
  const [messages, setMessages] = useState([
    { id: 1, text: `Hi! I'm interested in the ${productTitle}. Is it still available?`, sender: 'user' },
    { id: 2, text: `Hello! Yes it is. Let me know if you have any questions.`, sender: 'seller' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const newMsg = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages((prev) => [...prev, newMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate seller typing and replying
    setTimeout(() => {
      setIsTyping(false);
      const reply = { id: Date.now() + 1, text: `I can negotiate slightly if you can pick it up today.`, sender: 'seller' };
      setMessages((prev) => [...prev, reply]);
    }, 2000);
  };

  const quickReplies = ["Is the price negotiable?", "Can I pick it up tomorrow?", "What condition is it in?"];

  const handleQuickReply = (text) => {
    setInputValue(text);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white dark:bg-[#121212] flex flex-col z-[70] shadow-2xl border-l border-white/20 dark:border-gray-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 glass sticky top-0 border-b border-gray-100 dark:border-gray-800 z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-emerald-300 flex items-center justify-center text-white font-bold shadow-md">
                    {sellerName.charAt(0)}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#121212] rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white leading-tight flex items-center gap-1">
                    {sellerName} <ShieldCheck size={14} className="text-primary-500" />
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Online now • Active student</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <MoreHorizontal size={20} />
                </button>
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-black dark:hover:text-white bg-gray-50 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all rounded-full shadow-sm">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 dark:bg-[#121212]">
              <div className="text-center mb-6">
                 <span className="text-xs font-medium px-3 py-1 bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full inline-block">
                   Negotiation started
                 </span>
              </div>
              
              <div className="space-y-4">
                {messages.map((msg) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-black text-white dark:bg-white dark:text-black rounded-tr-sm' 
                        : 'bg-white dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-800 rounded-tl-sm shadow-md shadow-gray-200/50 dark:shadow-none'
                    }`}>
                      <p className="text-[15px] leading-relaxed">{msg.text}</p>
                      <span className={`text-[10px] mt-1 block font-medium ${msg.sender === 'user' ? 'text-gray-400 dark:text-gray-500 text-right' : 'text-gray-400'}`}>
                        Just now
                      </span>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white dark:bg-[#1a1a1a] px-4 py-3 rounded-2xl rounded-tl-sm border border-gray-100 dark:border-gray-800 flex items-center gap-1 shadow-sm">
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-[#121212] border-t border-gray-100 dark:border-gray-800">
              {/* Quick Replies */}
              <div className="flex gap-2 overflow-x-auto pb-3 mb-1 no-scrollbar snap-x">
                {quickReplies.map((reply, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleQuickReply(reply)}
                    className="shrink-0 snap-start px-4 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full transition-colors font-medium border border-transparent shadow-sm"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSend} className="relative flex items-center">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a message..." 
                  className="w-full pl-5 pr-14 py-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-inner text-gray-900 dark:text-white"
                />
                <button 
                  type="submit" 
                  disabled={!inputValue.trim()}
                  className={`absolute right-2 p-2.5 rounded-full transition-all ${
                    inputValue.trim() 
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-md hover:scale-105' 
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send size={18} className={inputValue.trim() ? "translate-x-0.5" : ""} />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
