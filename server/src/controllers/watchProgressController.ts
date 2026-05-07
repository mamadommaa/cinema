import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getWatchProgress = async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Не авторизован' });
        }

        const [rows] = await pool.query(
            `SELECT movie_id AS movieId, progress, completed
             FROM watch_progress
             WHERE user_id = ?`,
            [userId]
        );

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

export const updateWatchProgress = async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;
        const { movieId, progress } = req.body;

        if (!userId) {
            return res.status(401).json({ error: 'Не авторизован' });
        }

        if (!movieId || typeof progress !== 'number') {
            return res.status(400).json({ error: 'Неверные данные' });
        }

        const completed = progress >= 95;

        await pool.query(
            `INSERT INTO watch_progress (user_id, movie_id, progress, completed)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
             progress = VALUES(progress),
             completed = VALUES(completed),
             updated_at = CURRENT_TIMESTAMP`,
            [userId, movieId, progress, completed]
        );

        res.json({ movieId, progress, completed });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};
