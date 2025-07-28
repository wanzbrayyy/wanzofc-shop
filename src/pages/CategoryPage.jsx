
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from '@/components/ui/use-toast';

const CategoryPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Load products from localStorage
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(storedProducts);
  }, []);

  const categories = [
    { id: 'all', name: 'Semua Kategori', icon: 'fas fa-th', color: 'from-gray-600 to-gray-800' },
    { id: 'software', name: 'Software', icon: 'fas fa-laptop-code', color: 'from-blue-500 to-purple-600' },
    { id: 'games', name: 'Games', icon: 'fas fa-gamepad', color: 'from-green-500 to-blue-500' },
    { id: 'mobile', name: 'Mobile Apps', icon: 'fas fa-mobile-alt', color: 'from-pink-500 to-red-500' },
    { id: 'templates', name: 'Templates', icon: 'fas fa-palette', color: 'from-yellow-500 to-orange-500' },
    { id: 'ebooks', name: 'E-Books', icon: 'fas fa-book', color: 'from-indigo-500 to-purple-500' },
    { id: 'courses', name: 'Courses', icon: 'fas fa-graduation-cap', color: 'from-red-500 to-pink-500' },
    { id: 'tools', name: 'Tools', icon: 'fas fa-tools', color: 'from-orange-500 to-red-500' }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    toast({
      title: `📂 Kategori ${categories.find(c => c.id === categoryId)?.name}`,
      description: `Menampilkan ${filteredProducts.length} produk`
    });
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="min-h-screen p-4">
      <Helmet>
        <title>Kategori Produk - WanzoFC Shop</title>
        <meta name="description" content="Jelajahi berbagai kategori produk digital di WanzoFC Shop. Temukan software, games, aplikasi mobile, dan banyak lagi." />
      </Helmet>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold orbitron gradient-text mb-4">
          <i className="fas fa-th-large mr-3"></i>
          Kategori Produk
        </h1>
        <p className="text-gray-300 text-lg">
          Temukan produk digital sesuai kebutuhan Anda
        </p>
      </motion.div>

      {/* Category Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleCategoryClick(category.id)}
              className={`product-card p-6 rounded-xl cursor-pointer hover-lift bg-gradient-to-br ${category.color} ${
                selectedCategory === category.id ? 'ring-2 ring-blue-400 neon-glow' : ''
              }`}
            >
              <div className="text-center">
                <i className={`${category.icon} text-3xl mb-3 text-white`}></i>
                <h3 className="text-lg font-bold text-white mb-1">{category.name}</h3>
                <p className="text-gray-200 text-sm">
                  {category.id === 'all' 
                    ? `${products.length} Produk` 
                    : `${products.filter(p => p.category === category.id).length} Produk`
                  }
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Products Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold orbitron neon-text">
            {categories.find(c => c.id === selectedCategory)?.name || 'Semua Kategori'}
          </h2>
          <span className="text-gray-400">
            {filteredProducts.length} produk ditemukan
          </span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleProductClick(product)}
                className="product-card p-6 rounded-xl cursor-pointer hover-lift"
              >
                <div className="relative mb-4">
                  <img  
                    className="w-full h-48 object-cover rounded-lg"
                    alt={`${product.title} - ${product.description}`}
                   src="https://images.unsplash.com/photo-1542744095-291d1f67b221" />
                  <div className="absolute top-2 right-2">
                    <span className="status-badge status-available">
                      <i className="fas fa-check mr-1"></i>
                      Tersedia
                    </span>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                      {categories.find(c => c.id === product.category)?.name || 'Umum'}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{product.title}</h3>
                <p className="text-gray-300 mb-4 line-clamp-2">{product.description}</p>
                
                <div className="flex justify-between items-center">
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
            className="text-center py-16"
          >
            <i className="fas fa-search text-6xl text-gray-500 mb-4"></i>
            <h3 className="text-2xl font-bold text-gray-400 mb-2">
              Tidak ada produk ditemukan
            </h3>
            <p className="text-gray-500 mb-6">
              Belum ada produk dalam kategori ini
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="btn-primary px-6 py-3 rounded-lg mr-4"
            >
              <i className="fas fa-th mr-2"></i>
              Lihat Semua Kategori
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="btn-secondary px-6 py-3 rounded-lg"
            >
              <i className="fas fa-plus mr-2"></i>
              Tambah Produk
            </button>
          </motion.div>
        )}
      </motion.section>

      {/* Quick Actions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-12 mb-8"
      >
        <div className="glass-effect p-6 rounded-xl">
          <h3 className="text-xl font-bold orbitron neon-text mb-4">
            <i className="fas fa-bolt mr-2"></i>
            Aksi Cepat
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/products')}
              className="btn-primary p-4 rounded-lg text-center"
            >
              <i className="fas fa-box text-2xl mb-2"></i>
              <div className="text-sm">Semua Produk</div>
            </button>
            <button
              onClick={() => navigate('/chat-admin')}
              className="telegram-link p-4 rounded-lg text-center text-white"
            >
              <i className="fab fa-telegram-plane text-2xl mb-2"></i>
              <div className="text-sm">Chat Admin</div>
            </button>
            <button
              onClick={() => toast({
                title: "🔍 Fitur Pencarian",
                description: "Gunakan search bar di halaman utama untuk mencari produk"
              })}
              className="btn-secondary p-4 rounded-lg text-center"
            >
              <i className="fas fa-search text-2xl mb-2"></i>
              <div className="text-sm">Cari Produk</div>
            </button>
            <button
              onClick={() => toast({
                title: "⭐ Wishlist",
                description: "Fitur wishlist akan segera hadir!"
              })}
              className="bg-gradient-to-r from-pink-500 to-purple-600 p-4 rounded-lg text-center text-white"
            >
              <i className="fas fa-heart text-2xl mb-2"></i>
              <div className="text-sm">Wishlist</div>
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default CategoryPage;
