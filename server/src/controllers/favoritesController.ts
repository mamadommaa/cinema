import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getFavorites = async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Не авторизован' });
        }

        const [favorites] = await pool.query(
            `SELECT m.*
             FROM favorites f
             JOIN movies m ON f.movie_id = m.id
             WHERE f.user_id = ?
             ORDER BY f.created_at DESC`,
            [userId]
        ) as any[];

        res.json(favorites);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка загрузки избранного' });
    }
};

export const addFavorite = async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;
        const { id: movieId } = req.body;

        if (!userId) {
            return res.status(401).json({ error: 'Не авторизован' });
        }

        if (!movieId) {
            return res.status(400).json({ error: 'ID фильма обязателен' });
        }
        await pool.query(
            `INSERT INTO favorites (user_id, movie_id) VALUES (?, ?)
             ON DUPLICATE KEY UPDATE id = id`,
            [userId, movieId]
        );

        const [movie] = await pool.query(
            `SELECT * FROM movies WHERE id = ?`,
            [movieId]
        ) as any[];

        res.status(201).json(movie[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка добавления в избранное' });
    }
};

export const removeFavorite = async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;
        const movieId = req.params.movieId;

        if (!userId) {
            return res.status(401).json({ error: 'Не авторизован' });
        }

        await pool.query(
            `DELETE FROM favorites WHERE user_id = ? AND movie_id = ?`,
            [userId, movieId]
        );

        res.status(200).json({ message: 'Фильм удалён из избранного', id: Number(movieId) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка удаления из избранного' });
    }
};
