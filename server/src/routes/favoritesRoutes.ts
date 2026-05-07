import { Router } from 'express';

import { getFavorites, addFavorite, removeFavorite } from '../controllers/favoritesController';

const router = Router();

router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:movieId', removeFavorite);

export default router;
