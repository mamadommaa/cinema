import { Request, Response } from 'express';
import { pool } from '../config/db';
import { RowDataPacket, OkPacket, ResultSetHeader } from 'mysql2';

// Тип для фильма
interface Movie extends RowDataPacket {
    id: number;
    title: string;
    // добавь остальные поля из твоей таблицы movies
}

// Тип для жанра
interface GenreRow extends RowDataPacket {
    genre_name: string;
}

export const getLastWatched = async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Не авторизован' });
        }

        const [rows] = await pool.query<Movie[]>(
            `SELECT m.*
             FROM watch_progress wp
             JOIN movies m ON wp.movie_id = m.id
             WHERE wp.user_id = ?
               AND wp.completed = 1
               AND wp.updated_at >= DATE_SUB(NOW(), INTERVAL 14 DAY)
             ORDER BY wp.updated_at DESC
             LIMIT 3`,
            [userId]
        );

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

export const getRecommendationsByPreferences = async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Не авторизован' });
        }

        const [genreRows] = await pool.query<GenreRow[]>(
            `SELECT DISTINCT mg.genre_name
             FROM watch_progress wp
             JOIN movie_genres mg ON wp.movie_id = mg.movie_id
             WHERE wp.user_id = ? AND wp.completed = 1`,
            [userId]
        );

        if (!genreRows.length) {
            return res.json([]);
        }

        const favoriteGenres = genreRows.map(row => row.genre_name);
        const placeholders = favoriteGenres.map(() => '?').join(',');

        const [moviesRows] = await pool.query<Movie[]>(
            `SELECT m.*, COUNT(mg.genre_name) as match_count
             FROM movies m
             JOIN movie_genres mg ON m.id = mg.movie_id
             WHERE mg.genre_name IN (${placeholders})
               AND m.id NOT IN (
                   SELECT movie_id FROM watch_progress WHERE user_id = ? AND completed = 1
               )
             GROUP BY m.id
             ORDER BY match_count DESC
             LIMIT 3`,
            [...favoriteGenres, userId]
        );

        res.json(moviesRows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};
