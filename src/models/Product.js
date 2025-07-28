
// Product model for MongoDB using Mongoose
// This file defines the product schema and model

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['software', 'games', 'mobile', 'templates', 'ebooks', 'courses', 'tools'],
    default: 'software'
  },
  benefits: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  fileUrl: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'draft'],
    default: 'available'
  },
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
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

// Indexes for better performance
productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ createdAt: -1 });

// Virtual for formatted price
productSchema.virtual('formattedPrice').get(function() {
  return `Rp ${this.price.toLocaleString('id-ID')}`;
});

// Method to increment views
productSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to increment downloads
productSchema.methods.incrementDownloads = function() {
  this.downloads += 1;
  return this.save();
};

// Static method to find by category
productSchema.statics.findByCategory = function(category) {
  return this.find({ category, status: 'available' });
};

// Static method to search products
productSchema.statics.searchProducts = function(query) {
  return this.find({
    $text: { $search: query },
    status: 'available'
  }).sort({ score: { $meta: 'textScore' } });
};

const Product = mongoose.model('Product', productSchema);

export default Product;
