import { Router } from 'express';
import { getTop10, getRandom, getById, getGenres, getByGenre, searchMovies, getCurrentWeek } from '../controllers/movieController';

const router = Router();

router.get('/search', searchMovies);
router.get('/genres', getGenres);
router.get('/top10', getTop10);
router.get('/random', getRandom);
router.get('/current-week', getCurrentWeek);
router.get('/', getByGenre);
router.get('/:id', getById);

export default router;
