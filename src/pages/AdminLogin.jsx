import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { toast } from '@/components/ui/use-toast';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Hardcoded credentials for demonstration
    // In a real app, this would be an API call to a backend for authentication
    if (username === 'wanzofc' && password === '010308') {
      setTimeout(() => {
        localStorage.setItem('adminAuth', 'true');
        toast({
          title: "✅ Login Berhasil",
          description: "Selamat datang kembali, Admin!"
        });
        navigate('/admin');
        setIsLoading(false);
      }, 1500);
    } else {
      setTimeout(() => {
        toast({
          title: "❌ Login Gagal",
          description: "Username atau password salah.",
          variant: "destructive"
        });
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Helmet>
        <title>Admin Login - WanzoFC Shop</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-effect p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold orbitron gradient-text mb-2">
              Admin Access
            </h1>
            <p className="text-gray-400">
              Silakan login untuk mengelola WanzoFC Shop
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-user-shield mr-2"></i>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="wanzofc"
                className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-key mr-2"></i>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 rounded-lg text-lg font-bold flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Login
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;