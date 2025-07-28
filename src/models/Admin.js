import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    default: 'wanzofc'
  },
  password: {
    type: String,
    required: true,
  },
  telegramUsername: {
    type: String,
    required: true,
    trim: true,
    default: 'maverick_dark'
  },
  botToken: {
    type: String,
    required: true,
    trim: true
  },
  adminChatId: {
    type: String,
    required: true,
    trim: true
  },
  webhookUrl: {
    type: String,
    trim: true
  },
  botUsername: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    botName: {
      type: String,
      default: 'WanzoFC Shop'
    },
    botDescription: {
      type: String,
      default: '| 🚀 Toko Digital Masa Depan\n| ⚡️ Transaksi Cepat & Aman\n| 💯 Produk Berkualitas & Terpercaya'
    },
    autoApproveConfess: {
      type: Boolean,
      default: false
    },
    notifyNewProducts: {
      type: Boolean,
      default: true
    },
    notifyNewUsers: {
      type: Boolean,
      default: true
    },
    notifyPurchases: {
      type: Boolean,
      default: true
    },
    welcomeMessage: {
      type: String,
      default: 'Selamat datang di WanzoFC Shop! 🚀\n\nToko digital terpercaya dengan produk berkualitas tinggi.\n\nGunakan menu di bawah untuk menjelajahi produk kami.'
    },
    helpMessage: {
      type: String,
      default: 'Bantuan WanzoFC Shop:\n\n/start - Menu utama\n/products - Lihat produk\n/categories - Kategori\n/help - Bantuan\n/confess - Kirim pesan anonymous\n\nHubungi admin: @maverick_dark'
    }
  },
  stats: {
    totalMessages: {
      type: Number,
      default: 0
    },
    totalUsers: {
      type: Number,
      default: 0
    },
    totalConfesses: {
      type: Number,
      default: 0
    },
    lastActivity: {
      type: Date,
      default: Date.now
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

adminSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

adminSchema.methods.updateStats = function(type) {
  switch(type) {
    case 'message':
      this.stats.totalMessages += 1;
      break;
    case 'user':
      this.stats.totalUsers += 1;
      break;
    case 'confess':
      this.stats.totalConfesses += 1;
      break;
  }
  this.stats.lastActivity = new Date();
  return this.save();
};

adminSchema.statics.getActiveConfig = function() {
  return this.findOne({ isActive: true });
};

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;