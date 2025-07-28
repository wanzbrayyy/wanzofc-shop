import mongoose from 'mongoose';

const confessSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  isAnonymous: {
    type: Boolean,
    default: true
  },
  senderChatId: {
    type: String,
    required: function() {
      return !this.isAnonymous;
    }
  },
  senderUsername: {
    type: String,
    trim: true
  },
  targetUsername: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminResponse: {
    type: String,
    trim: true
  },
  respondedBy: {
    type: String,
    trim: true
  },
  respondedAt: {
    type: Date
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
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

confessSchema.index({ status: 1 });
confessSchema.index({ isAnonymous: 1 });
confessSchema.index({ createdAt: -1 });
confessSchema.index({ senderChatId: 1 });

confessSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

confessSchema.methods.approve = function(adminId, response) {
  this.status = 'approved';
  this.adminResponse = response;
  this.respondedBy = adminId;
  this.respondedAt = new Date();
  return this.save();
};

confessSchema.methods.reject = function(adminId, reason) {
  this.status = 'rejected';
  this.adminResponse = reason;
  this.respondedBy = adminId;
  this.respondedAt = new Date();
  return this.save();
};

confessSchema.statics.findPending = function() {
  return this.find({ status: 'pending' }).sort({ createdAt: -1 });
};

confessSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

const Confess = mongoose.model('Confess', confessSchema);

export default Confess;