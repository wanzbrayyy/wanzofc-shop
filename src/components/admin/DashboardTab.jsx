import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const DashboardTab = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(storedProducts);
  }, []);

  const handleFeatureClick = (featureName) => {
    toast({
        title: `🚧 Fitur ${featureName}`,
        description: "Fitur ini belum diimplementasikan sepenuhnya. Anda bisa memintanya di prompt berikutnya! 🚀",
    });
    if (featureName === 'Live Call') {
        navigate('/live-call');
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stats-card p-6 rounded-xl text-center">
          <i className="fas fa-box text-3xl text-blue-400 mb-3"></i>
          <div className="text-2xl font-bold text-white">{products.length}</div>
          <div className="text-gray-400">Total Produk</div>
        </div>
        <div className="stats-card p-6 rounded-xl text-center">
          <i className="fas fa-comments text-3xl text-green-400 mb-3"></i>
          <div className="text-2xl font-bold text-white">1</div>
          <div className="text-gray-400">Pesan Belum Dibaca</div>
        </div>
        <div className="stats-card p-6 rounded-xl text-center">
          <i className="fas fa-download text-3xl text-purple-400 mb-3"></i>
          <div className="text-2xl font-bold text-white">856</div>
          <div className="text-gray-400">Downloads</div>
        </div>
        <div className="stats-card p-6 rounded-xl text-center">
          <i className="fas fa-star text-3xl text-yellow-400 mb-3"></i>
          <div className="text-2xl font-bold text-white">4.9</div>
          <div className="text-gray-400">Rating</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-effect p-6 rounded-xl md:col-span-2">
            <h2 className="text-2xl font-bold orbitron neon-text mb-6">
            <i className="fas fa-clock mr-2"></i>
            Produk Terbaru
            </h2>
            {products.length > 0 ? (
            <div className="space-y-4">
                {products.slice(-5).reverse().map((product) => (
                <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                >
                    <div className="flex items-center space-x-4">
                        <img  class="w-12 h-12 object-cover rounded-lg" alt={product.title} src={product.images?.[0] || 'https://images.unsplash.com/photo-1542744095-291d1f67b221'} />
                        <div>
                            <h3 className="font-bold text-white">{product.title}</h3>
                            <p className="text-gray-400 text-sm">{product.category}</p>
                        </div>
                    </div>
                    <div className="text-right">
                    <div className="text-lg font-bold text-green-400">
                        Rp {product.price?.toLocaleString('id-ID')}
                    </div>
                    <div className="text-xs text-gray-400">
                        {new Date(product.createdAt).toLocaleDateString('id-ID')}
                    </div>
                    </div>
                </motion.div>
                ))}
            </div>
            ) : (
            <div className="text-center py-8">
                <i className="fas fa-box-open text-4xl text-gray-500 mb-4"></i>
                <p className="text-gray-400">Belum ada produk</p>
            </div>
            )}
        </div>
        <div className="glass-effect p-6 rounded-xl">
            <h2 className="text-2xl font-bold orbitron neon-text mb-6">
                <i className="fas fa-headset mr-2"></i>
                Pusat Komunikasi
            </h2>
            <div className="space-y-4">
                <button onClick={() => navigate('/chat-admin')} className="w-full btn-secondary py-3 rounded-lg flex items-center justify-center space-x-2">
                    <i className="fas fa-comments"></i>
                    <span>Live Chat</span>
                </button>
                <button onClick={() => handleFeatureClick('Live Call')} className="w-full btn-secondary py-3 rounded-lg flex items-center justify-center space-x-2">
                    <i className="fas fa-phone"></i>
                    <span>Live Call</span>
                </button>
                <button onClick={() => handleFeatureClick('Video Call')} className="w-full btn-secondary py-3 rounded-lg flex items-center justify-center space-x-2">
                    <i className="fas fa-video"></i>
                    <span>Video Call</span>
                </button>
                 <button onClick={() => handleFeatureClick('SMS Gateway')} className="w-full btn-secondary py-3 rounded-lg flex items-center justify-center space-x-2">
                    <i className="fas fa-sms"></i>
                    <span>SMS Gateway</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;