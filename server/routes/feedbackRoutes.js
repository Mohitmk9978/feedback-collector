import { Router } from 'express';
import {
  createFeedback,
  listFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
} from '../controllers/feedbackController.js';
import { protect } from '../middleware/auth.js';
import { uploadFeedbackImage } from '../middleware/upload.js';

const router = Router();

router.use(protect);

router.post('/', uploadFeedbackImage.single('image'), createFeedback);
router.get('/', listFeedback);
router.get('/:id', getFeedbackById);
router.put('/:id', uploadFeedbackImage.single('image'), updateFeedback);
router.delete('/:id', deleteFeedback);

export default router;
