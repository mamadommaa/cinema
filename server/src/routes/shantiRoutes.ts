import { Router } from 'express';
import { shantiChat } from '../controllers/shantiController';

const router = Router();

router.post('/chat', shantiChat);

export default router;
