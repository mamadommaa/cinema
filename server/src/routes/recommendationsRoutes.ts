import { Router } from 'express';
import { getLastWatched, getRecommendationsByPreferences } from '../controllers/recommendationsController';

const router = Router();

router.get('/last-watched', getLastWatched);
router.get('/by-preferences', getRecommendationsByPreferences);

export default router;
