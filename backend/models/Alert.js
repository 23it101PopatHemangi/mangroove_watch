import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Alert title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Alert description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  type: {
    type: String,
    enum: ['warning', 'danger', 'info', 'success'],
    required: [true, 'Alert type is required']
  },
  category: {
    type: String,
    enum: [
      'weather',
      'pollution',
      'wildlife',
      'conservation',
      'community',
      'system'
    ],
    required: [true, 'Alert category is required']
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: [true, 'Severity level is required']
  },
  location: {
    coordinates: {
      lat: Number,
      lng: Number
    },
    radius: {
      type: Number, // in kilometers
      default: 50
    },
    address: {
      city: String,
      state: String,
      country: String
    }
  },
  affectedAreas: [{
    name: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  }],
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'expired'],
    default: 'pending'
  },
  attachments: [{
    type: String, // URLs to files
    caption: String
  }],
  actions: [{
    title: String,
    description: String,
    url: String,
    isRequired: {
      type: Boolean,
      default: false
    }
  }],
  tags: [String],
  priority: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    }
  },
  metrics: {
    views: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    acknowledgments: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for geospatial queries
alertSchema.index({ 'location.coordinates': '2dsphere' });

// Index for efficient queries
alertSchema.index({ status: 1, isActive: 1, startDate: -1 });
alertSchema.index({ type: 1, severity: 1, isActive: 1 });
alertSchema.index({ category: 1, isActive: 1 });

// Method to check if alert is active
alertSchema.methods.isCurrentlyActive = function() {
  const now = new Date();
  return this.isActive && 
         this.status === 'approved' && 
         this.startDate <= now && 
         (!this.endDate || this.endDate >= now);
};

// Method to acknowledge alert
alertSchema.methods.acknowledge = function() {
  this.metrics.acknowledgments += 1;
};

// Method to increment views
alertSchema.methods.incrementViews = function() {
  this.metrics.views += 1;
};

// Method to increment shares
alertSchema.methods.incrementShares = function() {
  this.metrics.shares += 1;
};

// Static method to find active alerts in area
alertSchema.statics.findActiveInArea = function(lat, lng, radius = 50) {
  return this.find({
    isActive: true,
    status: 'approved',
    startDate: { $lte: new Date() },
    $or: [
      { endDate: { $gte: new Date() } },
      { endDate: { $exists: false } }
    ],
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        $maxDistance: radius * 1000 // Convert km to meters
      }
    }
  }).sort({ priority: -1, createdAt: -1 });
};

export default mongoose.model('Alert', alertSchema);
