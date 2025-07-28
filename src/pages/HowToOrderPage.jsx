import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

const HowToOrderPage = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: 'fas fa-search',
      title: '1. Cari & Pilih Produk',
      description: 'Jelajahi berbagai kategori produk kami atau gunakan fitur pencarian untuk menemukan produk digital yang Anda butuhkan. Klik pada produk untuk melihat detailnya.',
      color: 'text-blue-400'
    },
    {
      icon: 'fas fa-mouse-pointer',
      title: '2. Klik Tombol Beli',
      description: 'Pada halaman detail produk, klik tombol "Beli via Telegram". Ini adalah langkah awal untuk memulai proses pembelian Anda.',
      color: 'text-purple-400'
    },
    {
      icon: 'fab fa-telegram-plane',
      title: '3. Buka Bot Telegram',
      description: 'Anda akan secara otomatis diarahkan ke bot Telegram resmi WanzoFC Shop. Pastikan Anda berinteraksi dengan bot yang benar.',
      color: 'text-cyan-400'
    },
    {
      icon: 'fas fa-receipt',
      title: '4. Lakukan Pembayaran & Kirim Bukti',
      description: 'Bot akan memberikan instruksi pembayaran. Setelah transfer, kirimkan screenshot bukti pembayaran Anda dengan me-reply pesan dari bot.',
      color: 'text-green-400'
    },
    {
      icon: 'fas fa-user-check',
      title: '5. Verifikasi oleh Admin',
      description: 'Admin akan menerima notifikasi dan segera memverifikasi bukti pembayaran Anda. Proses ini biasanya cepat selama jam kerja.',
      color: 'text-yellow-400'
    },
    {
      icon: 'fas fa-download',
      title: '6. Terima Link Download',
      description: 'Setelah pembayaran terkonfirmasi, bot akan secara otomatis mengirimkan link download produk yang Anda beli. Selamat menikmati!',
      color: 'text-pink-400'
    },
  ];

  return (
    <div className="min-h-screen p-4">
      <Helmet>
        <title>Cara Order - WanzoFC Shop</title>
        <meta name="description" content="Panduan langkah demi langkah cara melakukan pemesanan produk digital di WanzoFC Shop melalui bot Telegram. Mudah, cepat, dan aman." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold orbitron gradient-text mb-4">
          <i className="fas fa-clipboard-list mr-3"></i>
          Cara Pemesanan
        </h1>
        <p className="text-gray-300 text-lg">
          Ikuti 6 langkah mudah ini untuk mendapatkan produk digital impian Anda.
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto space-y-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex flex-col md:flex-row items-center gap-6"
          >
            <div className={`w-24 h-24 rounded-full glass-effect flex-shrink-0 flex items-center justify-center border-2 border-opacity-50 ${step.color.replace('text-', 'border-')}`}>
              <i className={`${step.icon} ${step.color} text-4xl`}></i>
            </div>
            <div className="glass-effect p-6 rounded-xl flex-grow">
              <h2 className="text-2xl font-bold orbitron text-white mb-2">{step.title}</h2>
              <p className="text-gray-300 leading-relaxed">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: steps.length * 0.1 + 0.2 }}
        className="text-center mt-12"
      >
        <p className="text-gray-300 mb-4">Siap untuk memulai?</p>
        <button
          onClick={() => navigate('/products')}
          className="btn-primary px-8 py-4 rounded-xl text-lg font-bold"
        >
          <i className="fas fa-shopping-bag mr-2"></i>
          Mulai Belanja Sekarang
        </button>
      </motion.div>
    </div>
  );
};

export default HowToOrderPage;