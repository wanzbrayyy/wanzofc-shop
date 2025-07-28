import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', icon: 'fas fa-home', label: 'Home', path: '/' },
    { id: 'products', icon: 'fas fa-box', label: 'Produk', path: '/products' },
    { id: 'chat', icon: 'fas fa-comments', label: 'Chat Admin', path: '/chat-admin' },
    { id: 'confess', icon: 'fas fa-heart', label: 'Confess', path: '/confess' }
  ];

  const handleNavClick = (item) => {
    navigate(item.path);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 nav-bottom z-50"
    >
      <div className="flex justify-around items-center py-3 px-4">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => handleNavClick(item)}
            className={`nav-item flex flex-col items-center space-y-1 p-2 rounded-lg ${
              isActive(item.path) ? 'active' : ''
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <i className={`${item.icon} text-xl`}></i>
              {item.id === 'chat' && (
                <div className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">1</div>
              )}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default BottomNavigation;