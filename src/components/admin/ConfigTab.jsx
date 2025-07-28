import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const ConfigTab = () => {
  const [adminConfig, setAdminConfig] = useState({
    telegramUsername: 'maverick_dark',
    botToken: '',
    adminChatId: '',
    botName: 'WanzoFC Shop',
    botDescription: '| 🚀 Toko Digital Masa Depan\n| ⚡️ Transaksi Cepat & Aman\n| 💯 Produk Berkualitas & Terpercaya'
  });

  useEffect(() => {
    const storedConfig = JSON.parse(localStorage.getItem('adminConfig') || '{}');
    setAdminConfig(prev => ({ ...prev, ...storedConfig }));
  }, []);

  const handleConfigSave = () => {
    localStorage.setItem('adminConfig', JSON.stringify(adminConfig));
    toast({
      title: "⚙️ Konfigurasi disimpan",
      description: "Pengaturan admin telah diperbarui"
    });
  };

  return (
    <div className="glass-effect p-6 rounded-xl">
      <h2 className="text-2xl font-bold orbitron neon-text mb-6">
        <i className="fas fa-cog mr-2"></i>
        Konfigurasi Admin & Bot
      </h2>
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white"><i className="fas fa-robot mr-2"></i>Pengaturan Bot</h3>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nama Bot</label>
            <input type="text" value={adminConfig.botName} onChange={(e) => setAdminConfig(prev => ({ ...prev, botName: e.target.value }))} placeholder="WanzoFC Shop" className="form-input w-full px-4 py-3 rounded-lg focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi Bot</label>
            <textarea value={adminConfig.botDescription} onChange={(e) => setAdminConfig(prev => ({ ...prev, botDescription: e.target.value }))} placeholder="Deskripsi singkat bot..." rows={4} className="form-input w-full px-4 py-3 rounded-lg focus:outline-none resize-none" />
            <p className="text-xs text-gray-400 mt-1">Gunakan `|` untuk membuat efek visual.</p>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white"><i className="fab fa-telegram-plane mr-2"></i>Konfigurasi Telegram</h3>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username Telegram Admin</label>
            <input type="text" value={adminConfig.telegramUsername} onChange={(e) => setAdminConfig(prev => ({ ...prev, telegramUsername: e.target.value }))} placeholder="maverick_dark" className="form-input w-full px-4 py-3 rounded-lg focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Bot Token Telegram</label>
            <input type="password" value={adminConfig.botToken} onChange={(e) => setAdminConfig(prev => ({ ...prev, botToken: e.target.value }))} placeholder="Masukkan bot token dari @BotFather" className="form-input w-full px-4 py-3 rounded-lg focus:outline-none" />
            <p className="text-xs text-gray-400 mt-1">Dapatkan bot token dari @BotFather di Telegram.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Admin Chat ID</label>
            <input type="text" value={adminConfig.adminChatId} onChange={(e) => setAdminConfig(prev => ({ ...prev, adminChatId: e.target.value }))} placeholder="Chat ID admin untuk menerima notifikasi" className="form-input w-full px-4 py-3 rounded-lg focus:outline-none" />
            <p className="text-xs text-gray-400 mt-1">Gunakan @userinfobot untuk mendapatkan Chat ID Anda.</p>
          </div>
        </div>
        <div className="glass-effect p-4 rounded-lg">
          <h4 className="font-bold text-white mb-3"><i className="fas fa-terminal mr-2"></i>Preview Bot Commands</h4>
          <div className="space-y-2 text-sm font-mono">
            <div className="text-blue-400">/start - Menu utama</div>
            <div className="text-green-400">/menu - Tampilkan semua fitur</div>
            <div className="text-purple-400">/confess [pesan] - Kirim pesan anonymous</div>
            <div className="text-yellow-400">/menfess [@username] [pesan] - Kirim pesan ke user</div>
            <div className="text-pink-400">/board [pesan] - (Admin) Kirim broadcast</div>
          </div>
        </div>
        <button onClick={handleConfigSave} className="w-full btn-primary py-4 rounded-xl text-lg font-bold"><i className="fas fa-save mr-2"></i>Simpan Konfigurasi</button>
      </div>
    </div>
  );
};

export default ConfigTab;