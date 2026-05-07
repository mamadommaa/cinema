import { Router } from 'express';
import { getQuizByMovieId, submitQuizResult } from '../controllers/quizController';

const router = Router();


router.get('/:movieId', getQuizByMovieId);

router.post('/submit', submitQuizResult);

export default router;
