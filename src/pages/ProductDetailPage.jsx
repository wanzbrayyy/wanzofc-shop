import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from '@/components/ui/use-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminConfig, setAdminConfig] = useState({ botUsername: '' });
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setMainImage(foundProduct.images?.[0] || 'https://images.unsplash.com/photo-1542744095-291d1f67b221');
    }
    
    const config = JSON.parse(localStorage.getItem('adminConfig') || '{}');
    setAdminConfig(prev => ({ ...prev, ...config }));
    setLoading(false);
  }, [id]);
  
  const handleBuyNow = () => {
    if (!adminConfig.botUsername) {
      toast({ title: "⚠️ Konfigurasi Bot Belum Lengkap", variant: "destructive" });
      return;
    }
    const telegramUrl = `https://t.me/${adminConfig.botUsername}`;
    const command = `/beli ${product.id}`;
    const fullUrl = `${telegramUrl}?start=${btoa(command)}`;
    window.open(fullUrl, '_blank');
    toast({ title: "🚀 Menuju Telegram...", description: "Selesaikan pembelian di bot." });
  };

  const handleChatAdmin = () => {
    const telegramUrl = `https://t.me/${adminConfig.telegramUsername || 'maverick_dark'}`;
    window.open(telegramUrl, '_blank');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="loading-spinner"></div></div>;

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <i className="fas fa-exclamation-triangle text-6xl text-yellow-500 mb-4"></i>
        <h2 className="text-2xl font-bold text-white mb-4">Produk Tidak Ditemukan</h2>
        <button onClick={() => navigate('/products')} className="btn-primary px-6 py-3 rounded-lg">
          <i className="fas fa-arrow-left mr-2"></i>Kembali ke Produk
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen p-4">
      <Helmet>
        <title>{`${product.title} - WanzoFC Shop`}</title>
        <meta name="description" content={product.description} />
        <meta property="og:image" content={mainImage} />
      </Helmet>

      <motion.button onClick={() => navigate(-1)} className="btn-secondary px-4 py-2 rounded-lg mb-6">
        <i className="fas fa-arrow-left mr-2"></i>Kembali
      </motion.button>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="relative">
              <motion.img
                key={mainImage}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full h-96 object-cover rounded-xl scan-line"
                alt={product.title}
               src={mainImage} />
              <div className="absolute top-4 right-4"><span className="status-badge status-available">Tersedia</span></div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images?.map((img, index) => (
                <motion.div key={index} whileHover={{ scale: 1.05 }} className="cursor-pointer" onClick={() => setMainImage(img)}>
                  <img  
                    class={`w-full h-24 object-cover rounded-lg hover-lift ${mainImage === img ? 'ring-2 ring-blue-400' : ''}`}
                    alt={`${product.title} preview ${index + 1}`}
                    src={img}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold orbitron gradient-text mb-4">{product.title}</h1>
              <span className="price-tag px-4 py-2 rounded-full text-2xl font-bold">Rp {product.price?.toLocaleString('id-ID') || '0'}</span>
            </div>
            <div className="glass-effect p-6 rounded-xl">
              <h3 className="text-xl font-bold orbitron neon-text mb-4"><i className="fas fa-info-circle mr-2"></i>Deskripsi</h3>
              <p className="text-gray-300 leading-relaxed">{product.description}</p>
            </div>
            {product.benefits && (
              <div className="glass-effect p-6 rounded-xl">
                <h3 className="text-xl font-bold orbitron neon-text mb-4"><i className="fas fa-star mr-2"></i>Keuntungan</h3>
                <div className="space-y-2">
                  {product.benefits.split(',').map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <i className="fas fa-check-circle text-green-400"></i><span className="text-gray-300">{benefit.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-4">
              <button onClick={handleBuyNow} className="w-full btn-primary py-4 rounded-xl text-lg font-bold"><i className="fas fa-shopping-cart mr-2"></i>Beli via Telegram</button>
              <button onClick={handleChatAdmin} className="w-full telegram-link py-3 rounded-xl font-semibold"><i className="fab fa-telegram-plane mr-2"></i>Tanya Admin</button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;