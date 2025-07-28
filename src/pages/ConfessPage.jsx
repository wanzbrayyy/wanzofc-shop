import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { toast } from '@/components/ui/use-toast';

const ConfessPage = () => {
  const [mode, setMode] = useState('confess');
  const [message, setMessage] = useState('');
  const [targetUsername, setTargetUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!message.trim()) {
      toast({ title: '⚠️ Pesan tidak boleh kosong', variant: 'destructive' });
      return;
    }
    if (mode === 'menfess' && !targetUsername.trim()) {
      toast({ title: '⚠️ Username target diperlukan', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    toast({
      title: `📨 Mengirim ${mode}...`,
      description: 'Pesan Anda sedang diteruskan ke bot.',
    });
    
    // Simulate API call to bot
    setTimeout(() => {
        // Here you would typically make an API call to your backend,
        // which then uses the bot to send the message.
        console.log({
            type: mode,
            target: mode === 'menfess' ? targetUsername : 'admin',
            message: message
        });

        toast({
            title: `✅ ${mode.charAt(0).toUpperCase() + mode.slice(1)} Terkirim!`,
            description: 'Pesan Anda telah berhasil diproses oleh bot.',
        });

        setMessage('');
        setTargetUsername('');
        setIsSubmitting(false);
    }, 1500);

  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <Helmet>
        <title>Confess & Menfess - WanzoFC Shop</title>
        <meta name="description" content="Kirim pesan anonymous (confess) atau sampaikan pesan ke pengguna lain (menfess) melalui platform WanzoFC Shop." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <div className="glass-effect p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold orbitron gradient-text mb-2">
              <i className="fas fa-heart-pulse mr-3"></i>
              Confess & Menfess
            </h1>
            <p className="text-gray-300">
              Sampaikan pesanmu, secara rahasia atau terbuka.
            </p>
          </div>
          
          <div className="flex justify-center mb-6 bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setMode('confess')}
              className={`w-1/2 py-2 rounded-md transition-colors ${mode === 'confess' ? 'btn-primary' : 'text-gray-400'}`}
            >
              <i className="fas fa-user-secret mr-2"></i>Confess (Anonim)
            </button>
            <button
              onClick={() => setMode('menfess')}
              className={`w-1/2 py-2 rounded-md transition-colors ${mode === 'menfess' ? 'btn-primary' : 'text-gray-400'}`}
            >
              <i className="fas fa-paper-plane mr-2"></i>Menfess (ke User)
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {mode === 'menfess' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <i className="fab fa-telegram-plane mr-2"></i>
                    Username Telegram Tujuan
                  </label>
                  <input
                    type="text"
                    value={targetUsername}
                    onChange={(e) => setTargetUsername(e.target.value)}
                    placeholder="@username_tujuan"
                    className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                    required
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <i className="fas fa-comment-dots mr-2"></i>
                  Pesan Anda
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={mode === 'confess' ? 'Tulis pesan rahasiamu di sini...' : 'Tulis pesan untuknya di sini...'}
                  rows={5}
                  className="form-input w-full px-4 py-3 rounded-lg focus:outline-none resize-none"
                  required
                />
              </div>

              <div className="text-center text-xs text-gray-400">
                {mode === 'confess' 
                  ? 'Pesan akan dikirim secara anonim ke admin.'
                  : 'Pesan akan dikirim melalui bot ke username tujuan.'
                }
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-3 rounded-lg text-lg font-bold flex items-center justify-center"
              >
                {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <>
                        Kirim {mode === 'confess' ? 'Confess' : 'Menfess'}
                    </>
                )}
              </button>
            </motion.form>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfessPage;