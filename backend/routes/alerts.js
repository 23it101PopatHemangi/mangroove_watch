import express from 'express';
import {
  createAlert,
  getAlerts,
  getAlert,
  updateAlert,
  deleteAlert,
  approveAlert,
  acknowledgeAlert,
  getAlertsInArea,
  createAlertFromIncidents
} from '../controllers/alertController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAlerts);
router.get('/:id', getAlert);
router.get('/area/:lat/:lng', getAlertsInArea);

// Protected routes
router.post('/', protect, authorize('admin', 'moderator'), createAlert);
router.post('/from-incidents', protect, createAlertFromIncidents);
router.put('/:id', protect, authorize('admin', 'moderator'), updateAlert);
router.delete('/:id', protect, authorize('admin', 'moderator'), deleteAlert);
router.put('/:id/approve', protect, authorize('admin', 'moderator'), approveAlert);
router.post('/:id/acknowledge', protect, acknowledgeAlert);

export default router;
