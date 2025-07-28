import React, { useState, useRef } from 'react';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const AddProductTab = ({ setActiveTab }) => {
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    category: 'software',
    benefits: '',
    fileUrl: ''
  });
  const [images, setImages] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [fileDragOver, setFileDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleAddProduct = () => {
    if (!newProduct.title || !newProduct.description || !newProduct.price || images.length === 0) {
      toast({
        title: "⚠️ Data tidak lengkap",
        description: "Judul, deskripsi, harga, dan minimal 1 gambar wajib diisi.",
        variant: "destructive"
      });
      return;
    }

    const product = {
      id: Date.now().toString(),
      ...newProduct,
      price: parseInt(newProduct.price),
      images: images,
      createdAt: new Date().toISOString()
    };

    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const updatedProducts = [...products, product];
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    toast({
      title: "✅ Produk berhasil ditambahkan",
      description: `${product.title} telah ditambahkan ke katalog`
    });

    // Reset form and switch tab
    setNewProduct({ title: '', description: '', price: '', category: 'software', benefits: '', fileUrl: '' });
    setImages([]);
    setActiveTab('products');
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 4) {
      toast({ title: "Batas Maksimal 4 Gambar", variant: "destructive" });
      return;
    }
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...imageUrls]);
  };
  
  const handleDrop = (e, type) => {
    e.preventDefault();
    if(type === 'image') setDragOver(false);
    if(type === 'file') setFileDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (type === 'image') {
      if (images.length + files.length > 4) {
        toast({ title: "Batas Maksimal 4 Gambar", variant: "destructive" });
        return;
      }
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      const imageUrls = imageFiles.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...imageUrls]);
    } else {
        if(files.length > 0) {
            const file = files[0];
            const fileUrl = `uploads/${file.name}`;
            setNewProduct(prev => ({ ...prev, fileUrl }));
            toast({ title: "📁 File produk berhasil diupload", description: `${file.name} siap untuk digunakan` });
        }
    }
  };

  const categories = [
    { value: 'software', label: 'Software' }, { value: 'games', label: 'Games' },
    { value: 'mobile', label: 'Mobile Apps' }, { value: 'templates', label: 'Templates' },
    { value: 'ebooks', label: 'E-Books' }, { value: 'courses', label: 'Courses' }, { value: 'tools', label: 'Tools' }
  ];

  return (
    <div className="glass-effect p-6 rounded-xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2"><i className="fas fa-tag mr-2"></i>Nama Produk *</label>
            <input type="text" value={newProduct.title} onChange={(e) => setNewProduct(p => ({ ...p, title: e.target.value }))} placeholder="Nama produk" className="form-input w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2"><i className="fas fa-align-left mr-2"></i>Deskripsi *</label>
            <textarea value={newProduct.description} onChange={(e) => setNewProduct(p => ({ ...p, description: e.target.value }))} placeholder="Deskripsi produk" rows={4} className="form-input w-full resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2"><i className="fas fa-money-bill mr-2"></i>Harga *</label>
              <input type="number" value={newProduct.price} onChange={(e) => setNewProduct(p => ({ ...p, price: e.target.value }))} placeholder="0" className="form-input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2"><i className="fas fa-th-large mr-2"></i>Kategori</label>
              <select value={newProduct.category} onChange={(e) => setNewProduct(p => ({ ...p, category: e.target.value }))} className="form-input w-full">
                {categories.map(cat => <option key={cat.value} value={cat.value} className="bg-gray-800">{cat.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2"><i className="fas fa-star mr-2"></i>Keuntungan (pisahkan koma)</label>
            <textarea value={newProduct.benefits} onChange={(e) => setNewProduct(p => ({ ...p, benefits: e.target.value }))} placeholder="Keuntungan 1, Keuntungan 2" rows={2} className="form-input w-full resize-none" />
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2"><i className="fas fa-images mr-2"></i>Gambar Produk (Maks 4) *</label>
            <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={(e) => handleDrop(e, 'image')} onClick={() => fileInputRef.current?.click()} className={`file-upload p-4 text-center cursor-pointer ${dragOver ? 'dragover' : ''}`}>
              <i className="fas fa-cloud-upload-alt text-3xl text-blue-400 mb-2"></i>
              <p>Drag & drop atau klik untuk upload gambar</p>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} multiple accept="image/*" className="hidden" />
            </div>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {images.map((img, index) => (
                <motion.div key={index} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative">
                  <img  class="w-full h-20 object-cover rounded" alt={`preview ${index}`} src={img} />
                  <button onClick={() => setImages(images.filter((_, i) => i !== index))} className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs">&times;</button>
                </motion.div>
              ))}
            </div>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-300 mb-2"><i className="fas fa-file-upload mr-2"></i>Upload File Produk (Opsional)</label>
            <div onDragOver={(e) => { e.preventDefault(); setFileDragOver(true); }} onDragLeave={() => setFileDragOver(false)} onDrop={(e) => handleDrop(e, 'file')} className={`file-upload p-4 text-center cursor-pointer ${fileDragOver ? 'dragover' : ''}`}>
              <i className="fas fa-file-archive text-3xl text-purple-400 mb-2"></i>
              <p>Drag & drop atau klik untuk upload file ZIP</p>
            </div>
            {newProduct.fileUrl && (<div className="mt-2 p-2 bg-green-600/20 rounded"><i className="fas fa-check-circle text-green-400 mr-2"></i>{newProduct.fileUrl}</div>)}
          </div>
          <button onClick={handleAddProduct} className="w-full btn-primary py-3 rounded-xl text-lg font-bold"><i className="fas fa-plus mr-2"></i>Tambah Produk</button>
        </div>
      </div>
    </div>
  );
};

export default AddProductTab;