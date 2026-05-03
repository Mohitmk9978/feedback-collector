import { Router } from 'express';
import { getStats, updateStatus } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.put('/status/:id', updateStatus);

export default router;
