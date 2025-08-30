import express from 'express';
import twilio from 'twilio';

const router = express.Router();

// Twilio configuration (replace with your actual credentials)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

// Only create Twilio client if credentials are provided
let client = null;
if (accountSid && authToken && accountSid.startsWith('AC')) {
  client = twilio(accountSid, authToken);
}

// Send SMS report - ONLY STORE IN DATABASE
router.post('/send', async (req, res) => {
  try {
    const { phoneNumber, message, location } = req.body;
    
    // Import Report model
    const Report = (await import('../models/Report.js')).default;
    
         // Create SMS report in database
     const smsReport = new Report({
       title: `SMS Threat Report - ${new Date().toLocaleDateString()}`,
       description: message,
       category: 'other',
       severity: 'medium',
       location: {
         coordinates: {
           lat: parseFloat(location.split(',')[0]),
           lng: parseFloat(location.split(',')[1])
         }
       },
       tags: ['mangrove', 'environmental-threat', 'sms'],
       reportType: 'sms',
       phoneNumber: phoneNumber
       // No reporter field for SMS reports
     });
    
    await smsReport.save();
    
    console.log('SMS stored in database:', { phoneNumber, message, location });
    res.json({
      success: true,
      message: 'SMS report stored in database successfully',
      reportId: smsReport._id
    });
    
  } catch (error) {
    console.error('SMS storage failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to store SMS report',
      error: error.message
    });
  }
});

// Get SMS reports from database
router.get('/reports', async (req, res) => {
  try {
    // Import Report model
    const Report = (await import('../models/Report.js')).default;
    
    // Get all SMS reports from database
    const smsReports = await Report.find({ reportType: 'sms' })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({
      data: smsReports.map(report => ({
        id: report._id,
        phone: report.phoneNumber,
        message: report.description,
        location: `${report.location.coordinates.lat},${report.location.coordinates.lng}`,
        timestamp: report.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching SMS reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch SMS reports',
      error: error.message
    });
  }
});

export default router;
