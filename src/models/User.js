
// User model for MongoDB using Mongoose
// This file defines the user schema and model

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    trim: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  chatId: {
    type: String,
    required: true
  },
  isBot: {
    type: Boolean,
    default: false
  },
  languageCode: {
    type: String,
    default: 'id'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  purchases: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    purchaseDate: {
      type: Date,
      default: Date.now
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending'
    }
  }],
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'id'
    },
    categories: [{
      type: String
    }]
  },
  stats: {
    totalPurchases: {
      type: Number,
      default: 0
    },
    totalSpent: {
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

// Indexes
userSchema.index({ telegramId: 1 });
userSchema.index({ chatId: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

// Method to add purchase
userSchema.methods.addPurchase = function(productId, amount) {
  this.purchases.push({
    productId,
    amount,
    purchaseDate: new Date(),
    status: 'pending'
  });
  this.stats.totalPurchases += 1;
  this.stats.totalSpent += amount;
  this.stats.lastActivity = new Date();
  return this.save();
};

// Method to update last activity
userSchema.methods.updateActivity = function() {
  this.stats.lastActivity = new Date();
  return this.save();
};

// Static method to find by telegram ID
userSchema.statics.findByTelegramId = function(telegramId) {
  return this.findOne({ telegramId });
};

// Static method to find admins
userSchema.statics.findAdmins = function() {
  return this.find({ role: 'admin', isActive: true });
};

const User = mongoose.model('User', userSchema);

export default User;
