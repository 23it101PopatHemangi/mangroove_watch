import Alert from '../models/Alert.js';

// @desc    Create new alert
// @route   POST /api/alerts
// @access  Private (admin/moderator)
export const createAlert = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      category,
      severity,
      location,
      startDate,
      endDate,
      actions,
      tags
    } = req.body;

    const alert = await Alert.create({
      title,
      description,
      type,
      category,
      severity,
      location,
      startDate,
      endDate,
      actions: actions ? JSON.parse(actions) : [],
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      createdBy: req.user._id
    });

    await alert.populate('createdBy', 'username firstName lastName');

    res.status(201).json({
      success: true,
      data: alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all alerts
// @route   GET /api/alerts
// @access  Public
export const getAlerts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      category,
      severity,
      status,
      lat,
      lng,
      radius = 50,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { isPublic: true };
    
    if (type) query.type = type;
    if (category) query.category = category;
    if (severity) query.severity = severity;
    if (status) query.status = status;

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
    const alerts = await Alert.find(query)
      .populate('createdBy', 'username firstName lastName')
      .populate('approvedBy', 'username firstName lastName')
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Get total count
    const total = await Alert.countDocuments(query);

    res.json({
      success: true,
      data: alerts,
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

// @desc    Get single alert
// @route   GET /api/alerts/:id
// @access  Public
export const getAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id)
      .populate('createdBy', 'username firstName lastName')
      .populate('approvedBy', 'username firstName lastName');

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    // Increment view count
    alert.incrementViews();
    await alert.save();

    res.json({
      success: true,
      data: alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update alert
// @route   PUT /api/alerts/:id
// @access  Private (admin/moderator)
export const updateAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    // Check if user is authorized to update
    if (alert.createdBy.toString() !== req.user._id.toString() && 
        !['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this alert'
      });
    }

    const updatedAlert = await Alert.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username firstName lastName');

    res.json({
      success: true,
      data: updatedAlert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete alert
// @route   DELETE /api/alerts/:id
// @access  Private (admin/moderator)
export const deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    // Check if user is authorized to delete
    if (alert.createdBy.toString() !== req.user._id.toString() && 
        !['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this alert'
      });
    }

    await Alert.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Alert deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Approve alert
// @route   PUT /api/alerts/:id/approve
// @access  Private (admin/moderator)
export const approveAlert = async (req, res) => {
  try {
    const { verificationNotes } = req.body;

    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    alert.status = 'approved';
    alert.approvedBy = req.user._id;
    alert.approvedAt = new Date();
    if (verificationNotes) alert.verificationNotes = verificationNotes;

    await alert.save();
    await alert.populate('approvedBy', 'username firstName lastName');

    res.json({
      success: true,
      data: alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Acknowledge alert
// @route   POST /api/alerts/:id/acknowledge
// @access  Private
export const acknowledgeAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    alert.acknowledge();
    await alert.save();

    res.json({
      success: true,
      message: 'Alert acknowledged successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get active alerts in area
// @route   GET /api/alerts/area/:lat/:lng
// @access  Public
export const getAlertsInArea = async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const { radius = 50 } = req.query;

    const alerts = await Alert.findActiveInArea(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(radius)
    ).populate('createdBy', 'username firstName lastName');

    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create alert from nearby incidents
// @route   POST /api/alerts/from-incidents
// @access  Private
export const createAlertFromIncidents = async (req, res) => {
  try {
    const { incidents, reportLocation, reportDescription } = req.body;

    if (!incidents || !Array.isArray(incidents) || incidents.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No incidents provided'
      });
    }

    const createdAlerts = [];

    for (const incident of incidents) {
      const alertData = {
        title: `Environmental Threat: ${incident.type}`,
        description: `Multiple ${incident.type.toLowerCase()} incidents detected near your report location. ${reportDescription || 'Environmental threat reported in this area.'}`,
        type: 'danger',
        category: 'conservation',
        severity: 'high',
        location: {
          coordinates: {
            lat: incident.lat,
            lng: incident.lng
          },
          radius: 5 // 5km radius
        },
        startDate: new Date(incident.timestamp),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        tags: ['mangrove', 'environmental-threat', incident.type.toLowerCase().replace(' ', '-')],
        priority: 8,
        createdBy: req.user._id,
        status: 'approved', // Auto-approve since it's from verified incidents
        isActive: true,
        isPublic: true
      };

      const alert = await Alert.create(alertData);
      await alert.populate('createdBy', 'username firstName lastName');
      createdAlerts.push(alert);
    }

    res.status(201).json({
      success: true,
      message: `${createdAlerts.length} alerts created from nearby incidents`,
      data: createdAlerts
    });
  } catch (error) {
    console.error('Error creating alerts from incidents:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
