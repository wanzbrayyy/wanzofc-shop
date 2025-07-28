import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';

const ProductsTab = ({ setActiveTab }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(storedProducts);
  }, []);

  const handleDeleteProduct = (productId) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
    
    toast({
      title: "🗑️ Produk dihapus",
      description: "Produk telah dihapus dari katalog"
    });
  };

  const categories = [
    { value: 'software', label: 'Software' },
    { value: 'games', label: 'Games' },
    { value: 'mobile', label: 'Mobile Apps' },
    { value: 'templates', label: 'Templates' },
    { value: 'ebooks', label: 'E-Books' },
    { value: 'courses', label: 'Courses' },
    { value: 'tools', label: 'Tools' }
  ];

  return (
    <div className="glass-effect p-6 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold orbitron neon-text">
            <i className="fas fa-box mr-2"></i>
            Kelola Produk
        </h2>
        <button onClick={() => setActiveTab('add-product')} className="btn-primary px-4 py-2 rounded-lg">
            <i className="fas fa-plus mr-2"></i>Tambah Produk
        </button>
      </div>
      
      {products.length > 0 ? (
        <div className="space-y-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
            >
              <div className="flex-1 flex items-center space-x-4">
                 <img  class="w-16 h-16 object-cover rounded-lg" alt={product.title} src={product.images?.[0] || 'https://images.unsplash.com/photo-1542744095-291d1f67b221'} />
                <div>
                    <h3 className="font-bold text-white mb-1">{product.title}</h3>
                    <p className="text-gray-400 text-sm mb-2 line-clamp-1">{product.description}</p>
                    <div className="flex items-center space-x-4 text-xs">
                    <span className="bg-blue-600 bg-opacity-30 text-blue-300 px-2 py-1 rounded">
                        {categories.find(c => c.value === product.category)?.label}
                    </span>
                    <span className="text-green-400 font-bold">
                        Rp {product.price?.toLocaleString('id-ID')}
                    </span>
                    <span className="text-gray-500">
                        {new Date(product.createdAt).toLocaleDateString('id-ID')}
                    </span>
                    </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => toast({
                    title: "✏️ Edit Produk",
                    description: "Fitur edit akan segera tersedia!"
                  })}
                  className="btn-secondary px-3 py-2 rounded"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition-colors"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <i className="fas fa-box-open text-6xl text-gray-500 mb-4"></i>
          <p className="text-gray-400 text-lg mb-4">Belum ada produk</p>
          <button
            onClick={() => setActiveTab('add-product')}
            className="btn-primary px-6 py-3 rounded-lg"
          >
            <i className="fas fa-plus mr-2"></i>
            Tambah Produk Pertama
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsTab;