import { Router } from 'express';
import { getWatchProgress, updateWatchProgress } from '../controllers/watchProgressController';

const router = Router();

router.get('/', getWatchProgress);
router.post('/', updateWatchProgress);

export default router;
