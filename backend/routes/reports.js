import express from 'express';
import {
  createReport,
  getReports,
  getReport,
  updateReport,
  deleteReport,
  upvoteReport,
  removeUpvote,
  addComment,
  getMyReports
} from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../utils/uploadImage.js';

const router = express.Router();

// Public routes
router.get('/', getReports);
router.get('/:id', getReport);

// Protected routes
router.post('/', protect, upload.array('images', 5), createReport);
router.put('/:id', protect, updateReport);
router.delete('/:id', protect, deleteReport);
router.post('/:id/upvote', protect, upvoteReport);
router.delete('/:id/upvote', protect, removeUpvote);
router.post('/:id/comments', protect, addComment);
router.get('/user/me', protect, getMyReports);

export default router;
