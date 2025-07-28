import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import DashboardTab from '@/components/admin/DashboardTab';
import ProductsTab from '@/components/admin/ProductsTab';
import AddProductTab from '@/components/admin/AddProductTab';
import ConfigTab from '@/components/admin/ConfigTab';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    toast({
      title: "👋 Sampai jumpa!",
      description: "Anda telah berhasil logout."
    });
    navigate('/admin/login');
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { id: 'products', name: 'Kelola Produk', icon: 'fas fa-box' },
    { id: 'config', name: 'Konfigurasi', icon: 'fas fa-cog' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'products':
        return <ProductsTab setActiveTab={setActiveTab} />;
      case 'add-product':
        return <AddProductTab setActiveTab={setActiveTab} />;
      case 'config':
        return <ConfigTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="min-h-screen admin-panel p-4">
      <Helmet>
        <title>Admin Panel - WanzoFC Shop</title>
        <meta name="description" content="Panel admin untuk mengelola produk dan konfigurasi WanzoFC Shop" />
      </Helmet>

      <div className="flex justify-between items-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold orbitron gradient-text">
            <i className="fas fa-shield-alt mr-3"></i>
            Admin Panel
          </h1>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <i className="fas fa-sign-out-alt mr-2"></i>
          Logout
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap justify-center gap-4 mb-8"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === tab.id
                ? 'btn-primary neon-glow'
                : 'btn-secondary'
            }`}
          >
            <i className={`${tab.icon} mr-2`}></i>
            {tab.name}
          </button>
        ))}
      </motion.div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-6xl mx-auto"
      >
        {renderTabContent()}
      </motion.div>
    </div>
  );
};

export default AdminPanel;