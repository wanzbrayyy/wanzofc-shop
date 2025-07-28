import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'completed', 'rejected'],
    default: 'pending'
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

purchaseSchema.index({ userId: 1 });
purchaseSchema.index({ status: 1 });

const Purchase = mongoose.model('Purchase', purchaseSchema);

export default Purchase;