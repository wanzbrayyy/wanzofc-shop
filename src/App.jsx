import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import LoadingScreen from '@/components/LoadingScreen';
import BottomNavigation from '@/components/BottomNavigation';
import HomePage from '@/pages/HomePage';
import CategoryPage from '@/pages/CategoryPage';
import ProductPage from '@/pages/ProductPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import AdminPanel from '@/pages/AdminPanel';
import AdminLogin from '@/pages/AdminLogin';
import HowToOrderPage from '@/pages/HowToOrderPage';
import ConfessPage from '@/pages/ConfessPage';
import LiveCallPage from '@/pages/LiveCallPage';
import ChatAdminPage from '@/pages/ChatAdminPage';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('adminAuth');
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

const AppContent = () => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState('home');

  const hideBottomNav = location.pathname.startsWith('/admin') || location.pathname === '/live-call';

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={!hideBottomNav ? "pb-20" : ""}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/how-to-order" element={<HowToOrderPage />} />
            <Route path="/confess" element={<ConfessPage />} />
            <Route path="/chat-admin" element={<ChatAdminPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin" 
              element={
                <PrivateRoute>
                  <AdminPanel />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/live-call" 
              element={
                <PrivateRoute>
                  <LiveCallPage />
                </PrivateRoute>
              } 
            />
          </Routes>
        </motion.div>
      </AnimatePresence>
      {!hideBottomNav && <BottomNavigation currentPage={currentPage} setCurrentPage={setCurrentPage} />}
    </>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <Helmet>
          <title>WanzoFC Shop - Toko Digital Terpercaya</title>
          <meta name="description" content="WanzoFC Shop adalah toko digital terpercaya yang menyediakan berbagai produk digital berkualitas dengan harga terjangkau." />
          <meta name="keywords" content="toko digital, produk digital, software, game, aplikasi, wanzofc" />
          <meta property="og:title" content="WanzoFC Shop - Toko Digital Terpercaya" />
          <meta property="og:description" content="Toko digital terpercaya dengan berbagai produk berkualitas" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
        </Helmet>
        
        <AppContent />
        
        <Toaster />
      </div>
    </Router>
  );
}

export default App;