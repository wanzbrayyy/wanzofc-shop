import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from '@/components/ui/use-toast';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    setAllProducts(products);
    setFeaturedProducts(products.slice(0, 3));
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    const filtered = allProducts.filter(product =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
    setSearchResults(filtered);
  }, [searchQuery, allProducts]);

  const handleSearchRedirect = () => {
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  const howToOrderSteps = [
    { icon: 'fas fa-search', title: 'Cari Produk', description: 'Jelajahi atau cari produk digital yang Anda inginkan.' },
    { icon: 'fas fa-mouse-pointer', title: 'Pilih & Beli', description: 'Klik tombol "Beli" pada produk pilihan Anda.' },
    { icon: 'fab fa-telegram-plane', title: 'Redirect ke Bot', description: 'Anda akan diarahkan ke bot Telegram kami untuk melanjutkan.' },
    { icon: 'fas fa-receipt', title: 'Kirim Bukti Bayar', description: 'Lakukan pembayaran dan kirim screenshot bukti ke bot.' },
    { icon: 'fas fa-download', title: 'Terima Produk', description: 'Admin akan verifikasi & mengirimkan link download produk Anda.' },
  ];

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>WanzoFC Shop - Toko Digital Terpercaya</title>
        <meta name="description" content="Selamat datang di WanzoFC Shop, toko digital terpercaya dengan berbagai produk berkualitas tinggi, alur pemesanan mudah via Telegram, dan fitur confess anonymous." />
      </Helmet>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="hero-section p-6 m-4 rounded-2xl scan-line"
      >
        <div className="text-center py-8">
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold orbitron gradient-text mb-4"
          >
            WanzoFC Shop
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto"
          >
            🚀 Toko Digital Masa Depan dengan Alur Belanja Canggih via Telegram
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative max-w-lg mx-auto"
          >
            <div className="flex">
                <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari software, game, atau template..."
                className="search-bar flex-1 px-4 py-3 rounded-l-lg text-white placeholder-gray-400 focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleSearchRedirect()}
                />
                <button
                onClick={handleSearchRedirect}
                className="btn-primary px-6 py-3 rounded-r-lg"
                >
                <i className="fas fa-search"></i>
                </button>
            </div>
            {searchResults.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute w-full mt-2 bg-gray-800 bg-opacity-90 backdrop-blur-sm border border-blue-500/50 rounded-lg z-10">
                {searchResults.map(product => (
                  <div key={product.id} onClick={() => handleProductClick(product)} className="p-3 hover:bg-blue-500/20 cursor-pointer border-b border-gray-700/50 flex items-center space-x-3">
                    <img  class="w-10 h-10 object-cover rounded" alt={product.title} src="https://images.unsplash.com/photo-1559223669-e0065fa7f142" />
                    <div>
                        <p className="font-bold text-white">{product.title}</p>
                        <p className="text-sm text-gray-400">Rp {product.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* How to Order */}
      <section className="p-4">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl text-center font-bold orbitron gradient-text mb-8"
        >
          <i className="fas fa-clipboard-list mr-2"></i>
          Cara Order Super Gampang!
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {howToOrderSteps.map((step, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                    className="glass-effect p-6 rounded-xl text-center"
                >
                    <div className="text-4xl mb-4 text-blue-400"><i className={step.icon}></i></div>
                    <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-300 text-sm">{step.description}</p>
                </motion.div>
            ))}
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="p-4">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl text-center font-bold orbitron gradient-text mb-8"
        >
          <i className="fas fa-star mr-2"></i>
          Produk Unggulan
        </motion.h2>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleProductClick(product)}
                className="product-card p-4 rounded-xl cursor-pointer hover-lift flex flex-col"
              >
                <div className="relative mb-4">
                  <img 
                    class="w-full h-48 object-cover rounded-lg"
                    alt={product.title}
                   src="https://images.unsplash.com/photo-1702479744451-ccd6e31495d5" />
                  <div className="absolute top-2 right-2">
                    <span className="status-badge status-available">
                      <i className="fas fa-check mr-1"></i>
                      Tersedia
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{product.title}</h3>
                <p className="text-gray-300 mb-4 line-clamp-2 flex-grow">{product.description}</p>
                
                <div className="flex justify-between items-center mt-auto">
                  <span className="price-tag px-3 py-1 rounded-full text-lg font-bold">
                    Rp {product.price?.toLocaleString('id-ID') || '0'}
                  </span>
                  <button className="btn-secondary px-4 py-2 rounded-lg">
                    <i className="fas fa-eye mr-2"></i>
                    Detail
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <i className="fas fa-box-open text-6xl text-gray-500 mb-4"></i>
            <p className="text-gray-400 text-lg">Belum ada produk unggulan</p>
          </motion.div>
        )}
         <div className="text-center mt-8">
            <button onClick={() => navigate('/products')} className="btn-primary px-8 py-3 rounded-lg text-lg">
                Lihat Semua Produk <i className="fas fa-arrow-right ml-2"></i>
            </button>
        </div>
      </section>
      
      {/* Confess/Menfess Section */}
      <section className="p-4 my-8">
        <div className="glass-effect rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
                <h2 className="text-3xl font-bold orbitron gradient-text mb-4">Punya Pesan Rahasia?</h2>
                <p className="text-gray-300 mb-6">Kirim pesan confess secara anonim atau menfess ke seseorang melalui bot kami. Cukup sampaikan isi hatimu, kami yang akan meneruskannya!</p>
                <button onClick={() => navigate('/confess')} className="btn-primary px-8 py-3 rounded-lg text-lg">
                    Kirim Confess/Menfess <i className="fas fa-paper-plane ml-2"></i>
                </button>
            </motion.div>
             <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center"
             >
                <i className="fas fa-user-secret text-8xl text-purple-400 floating"></i>
            </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;