import Report from '../models/Report.js';
import User from '../models/User.js';

// @desc    Create new report
// @route   POST /api/reports
// @access  Private
export const createReport = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      severity,
      location,
      tags
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !severity || !location) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, description, category, severity, location'
      });
    }

    // Validate location format
    if (!location.coordinates || !location.coordinates.lat || !location.coordinates.lng) {
      return res.status(400).json({
        success: false,
        message: 'Invalid location format. Expected: { coordinates: { lat: number, lng: number } }'
      });
    }

    // Format location data properly
    const formattedLocation = {
      coordinates: {
        lat: parseFloat(location.coordinates.lat),
        lng: parseFloat(location.coordinates.lng)
      }
    };

    // Create report
    const report = await Report.create({
      reporter: req.user._id,
      title,
      description,
      category,
      severity,
      location: formattedLocation,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : []),
      images: req.files ? req.files.map(file => ({
        url: file.path,
        publicId: file.filename
      })) : []
    });

    // Update user's report count and points
    const user = await User.findById(req.user._id);
    user.reportsCount += 1;
    user.points += 15; // Points for submitting a report
    user.updateLevel();
    await user.save();

    // Populate reporter info
    await report.populate('reporter', 'username firstName lastName avatar');

    res.status(201).json({
      success: true,
      data: report,
      message: 'Report submitted successfully! You earned +15 points!'
    });
  } catch (error) {
    console.error('Report creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
      details: error.stack
    });
  }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Public
export const getReports = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      severity,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      lat,
      lng,
      radius = 50
    } = req.query;

    // Build query
    const query = {};
    
    if (status) query.status = status;
    if (category) query.category = category;
    if (severity) query.severity = severity;

    // Geospatial query if coordinates provided
    if (lat && lng) {
      query['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseFloat(radius) * 1000 // Convert km to meters
        }
      };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const reports = await Report.find(query)
      .populate('reporter', 'username firstName lastName avatar')
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Get total count
    const total = await Report.countDocuments(query);

    res.json({
      success: true,
      data: reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Public
export const getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('reporter', 'username firstName lastName avatar')
      .populate('verification.verifiedBy', 'username firstName lastName')
      .populate('resolution.resolvedBy', 'username firstName lastName')
      .populate('comments.user', 'username firstName lastName avatar')
      .populate('upvotes.user', 'username');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Increment view count
    report.metrics.views += 1;
    await report.save();

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update report
// @route   PUT /api/reports/:id
// @access  Private (reporter or admin)
export const updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check if user is authorized to update
    if (report.reporter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this report'
      });
    }

    // Only allow updates if report is pending or under review
    if (!['pending', 'under_review'].includes(report.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update report that has been processed'
      });
    }

    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('reporter', 'username firstName lastName avatar');

    res.json({
      success: true,
      data: updatedReport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private (reporter or admin)
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check if user is authorized to delete
    if (report.reporter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this report'
      });
    }

    await Report.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Upvote report
// @route   POST /api/reports/:id/upvote
// @access  Private
export const upvoteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    const wasAdded = report.addUpvote(req.user._id);
    await report.save();

    if (wasAdded) {
      // Give points to reporter
      const reporter = await User.findById(report.reporter);
      reporter.points += 5;
      reporter.updateLevel();
      await reporter.save();
    }

    res.json({
      success: true,
      data: {
        upvoted: wasAdded,
        upvoteCount: report.upvoteCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Remove upvote from report
// @route   DELETE /api/reports/:id/upvote
// @access  Private
export const removeUpvote = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    const wasRemoved = report.removeUpvote(req.user._id);
    await report.save();

    res.json({
      success: true,
      data: {
        upvoted: false,
        upvoteCount: report.upvoteCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Add comment to report
// @route   POST /api/reports/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    report.addComment(req.user._id, content, req.user.role === 'admin');
    await report.save();

    // Populate the new comment
    await report.populate('comments.user', 'username firstName lastName avatar');

    const newComment = report.comments[report.comments.length - 1];

    res.json({
      success: true,
      data: newComment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user's reports
// @route   GET /api/reports/user/me
// @access  Private
export const getMyReports = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reports = await Report.find({ reporter: req.user._id })
      .populate('reporter', 'username firstName lastName avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Report.countDocuments({ reporter: req.user._id });

    res.json({
      success: true,
      data: reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
