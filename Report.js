import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Report title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Report description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  location: {
    coordinates: {
      lat: {
        type: Number,
        required: [true, 'Latitude is required']
      },
      lng: {
        type: Number,
        required: [true, 'Longitude is required']
      }
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String
    }
  },
  category: {
    type: String,
    enum: [
      'deforestation',
      'pollution',
      'illegal_construction',
      'wildlife_threat',
      'plastic_waste',
      'oil_spill',
      'overfishing',
      'climate_impact',
      'other'
    ],
    required: [true, 'Report category is required']
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: [true, 'Severity level is required'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'verified', 'resolved', 'rejected'],
    default: 'pending'
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: String,
    caption: String
  }],
  evidence: {
    additionalPhotos: [String],
    documents: [String],
    videos: [String]
  },
  aiAnalysis: {
    confidence: {
      type: Number,
      min: 0,
      max: 100
    },
    threatType: String,
    recommendations: [String],
    processedAt: Date
  },
  verification: {
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date,
    verificationNotes: String
  },
  resolution: {
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: Date,
    resolutionNotes: String,
    actionTaken: String
  },
  tags: [String],
  upvotes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isOfficial: {
      type: Boolean,
      default: false
    }
  }],
  metrics: {
    views: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    responseTime: Number // in hours
  }
}, {
  timestamps: true
});

// Index for geospatial queries
reportSchema.index({ 'location.coordinates': '2dsphere' });

// Index for efficient queries
reportSchema.index({ status: 1, severity: 1, createdAt: -1 });
reportSchema.index({ reporter: 1, createdAt: -1 });
reportSchema.index({ category: 1, status: 1 });

// Virtual for upvote count
reportSchema.virtual('upvoteCount').get(function() {
  return this.upvotes.length;
});

// Virtual for comment count
reportSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Method to add upvote
reportSchema.methods.addUpvote = function(userId) {
  const existingUpvote = this.upvotes.find(upvote => 
    upvote.user.toString() === userId.toString()
  );
  
  if (!existingUpvote) {
    this.upvotes.push({ user: userId });
    return true;
  }
  return false;
};

// Method to remove upvote
reportSchema.methods.removeUpvote = function(userId) {
  const initialLength = this.upvotes.length;
  this.upvotes = this.upvotes.filter(upvote => 
    upvote.user.toString() !== userId.toString()
  );
  return this.upvotes.length < initialLength;
};

// Method to add comment
reportSchema.methods.addComment = function(userId, content, isOfficial = false) {
  this.comments.push({
    user: userId,
    content,
    isOfficial
  });
};

// Ensure virtuals are included in JSON output
reportSchema.set('toJSON', { virtuals: true });
reportSchema.set('toObject', { virtuals: true });

export default mongoose.model('Report', reportSchema);
