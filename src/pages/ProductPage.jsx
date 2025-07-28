
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from '@/components/ui/use-toast';

const ProductPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    // Load products from localStorage
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(storedProducts);
    setFilteredProducts(storedProducts);
  }, []);

  useEffect(() => {
    // Filter and sort products
    let filtered = products;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(product => product.category === filterCategory);
    }

    // Sort products
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, sortBy, filterCategory]);

  const categories = [
    { id: 'all', name: 'Semua' },
    { id: 'software', name: 'Software' },
    { id: 'games', name: 'Games' },
    { id: 'mobile', name: 'Mobile Apps' },
    { id: 'templates', name: 'Templates' },
    { id: 'ebooks', name: 'E-Books' },
    { id: 'courses', name: 'Courses' },
    { id: 'tools', name: 'Tools' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Terbaru' },
    { value: 'oldest', label: 'Terlama' },
    { value: 'price-low', label: 'Harga Terendah' },
    { value: 'price-high', label: 'Harga Tertinggi' },
    { value: 'name', label: 'Nama A-Z' }
  ];

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  const handleSearch = () => {
    // Search is handled by useEffect
    toast({
      title: "🔍 Pencarian diperbarui",
      description: `Ditemukan ${filteredProducts.length} produk`
    });
  };

  return (
    <div className="min-h-screen p-4">
      <Helmet>
        <title>Semua Produk - WanzoFC Shop</title>
        <meta name="description" content="Jelajahi koleksi lengkap produk digital di WanzoFC Shop. Software, games, aplikasi, dan banyak lagi dengan harga terjangkau." />
      </Helmet>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold orbitron gradient-text mb-4">
          <i className="fas fa-box mr-3"></i>
          Semua Produk
        </h1>
        <p className="text-gray-300 text-lg">
          Koleksi lengkap produk digital berkualitas tinggi
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-effect p-6 rounded-xl mb-8"
      >
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk..."
              className="search-bar flex-1 px-4 py-3 rounded-l-lg text-white placeholder-gray-400 focus:outline-none"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="btn-primary px-6 py-3 rounded-r-lg"
            >
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Category Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <i className="fas fa-filter mr-2"></i>
              Kategori
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id} className="bg-gray-800">
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <i className="fas fa-sort mr-2"></i>
              Urutkan
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-gray-800">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="mt-4 text-center">
          <span className="text-gray-400">
            Menampilkan {filteredProducts.length} dari {products.length} produk
          </span>
        </div>
      </motion.section>

      {/* Products Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
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
                
                {/* Benefits */}
                {product.benefits && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {product.benefits.split(',').slice(0, 2).map((benefit, idx) => (
                        <span key={idx} className="bg-blue-600 bg-opacity-30 text-blue-300 px-2 py-1 rounded text-xs">
                          {benefit.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
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
              Coba ubah kata kunci pencarian atau filter kategori
            </p>
            <div className="space-x-4">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterCategory('all');
                }}
                className="btn-primary px-6 py-3 rounded-lg"
              >
                <i className="fas fa-refresh mr-2"></i>
                Reset Filter
              </button>
              <button
                onClick={() => navigate('/admin')}
                className="btn-secondary px-6 py-3 rounded-lg"
              >
                <i className="fas fa-plus mr-2"></i>
                Tambah Produk
              </button>
            </div>
          </motion.div>
        )}
      </motion.section>

      {/* Quick Stats */}
      {products.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 mb-8"
        >
          <div className="glass-effect p-6 rounded-xl">
            <h3 className="text-xl font-bold orbitron neon-text mb-4 text-center">
              <i className="fas fa-chart-bar mr-2"></i>
              Statistik Produk
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{products.length}</div>
                <div className="text-sm text-gray-400">Total Produk</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {new Set(products.map(p => p.category)).size}
                </div>
                <div className="text-sm text-gray-400">Kategori</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  Rp {Math.min(...products.map(p => p.price || 0)).toLocaleString('id-ID')}
                </div>
                <div className="text-sm text-gray-400">Harga Terendah</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400">
                  Rp {Math.max(...products.map(p => p.price || 0)).toLocaleString('id-ID')}
                </div>
                <div className="text-sm text-gray-400">Harga Tertinggi</div>
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default ProductPage;
