

import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getGenres = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT name FROM genres ORDER BY name');
        const genres = (rows as any[]).map(row => row.name);
        res.json(genres);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

export const searchMovies = async (req: Request, res: Response) => {
    try {
        const query = req.query.query as string;

        if (!query || query.length < 2) {
            return res.json([]);
        }
        const [movies] = await pool.query(`
            SELECT
                id, title, posterUrl, tmdbRating, releaseYear,
                runtime, plot, backdropUrl, language,
                budget, revenue, director, production, awardsSummary,
                videoUrl
            FROM movies
            WHERE title LIKE ?
            LIMIT 10
        `, [`%${query}%`]) as any[];

        if (!movies || movies.length === 0) {
            return res.json([]);
        }

        for (const movie of movies) {
            const [genreRows] = await pool.query(
                'SELECT g.name FROM genres g JOIN movie_genres mg ON g.name = mg.genre_name WHERE mg.movie_id = ?',
                [movie.id]
            ) as any[];
            movie.genres = genreRows.map((row: any) => row.name);
        }

        res.json(movies);
    } catch (error) {
        console.error('Ошибка при поиске фильмов:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

export const getRandom = async (req: Request, res: Response) => {
    try {
        const [movies] = await pool.query(`
            SELECT
                id, title, posterUrl, tmdbRating, releaseYear,
                runtime, plot, backdropUrl, language,
                budget, revenue, director, production, awardsSummary,
                videoUrl
            FROM movies
            ORDER BY RAND()
            LIMIT 1
        `) as any[];

        if (!movies || movies.length === 0) {
            return res.status(404).json({ error: 'Фильмы не найдены' });
        }

        const movie = movies[0];

        const [genresRows] = await pool.query(
            'SELECT g.name FROM genres g JOIN movie_genres mg ON g.name = mg.genre_name WHERE mg.movie_id = ?',
            [movie.id]
        ) as any[];

        movie.genres = genresRows.map((row: any) => row.name);

        res.json(movie);
    } catch (error) {
        console.error('Ошибка при получении случайного фильма:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

export const getTop10 = async (req: Request, res: Response) => {
    try {
        const [movies] = await pool.query(`
            SELECT
                id, title, posterUrl, tmdbRating, releaseYear,
                runtime, plot, backdropUrl, language,
                budget, revenue, director, production, awardsSummary,
                videoUrl
            FROM movies
            WHERE tmdbRating IS NOT NULL
            ORDER BY tmdbRating DESC
            LIMIT 10
        `) as any[];

        if (!movies || movies.length === 0) {
            return res.status(404).json({ error: 'Фильмы не найдены' });
        }
        for (const movie of movies) {
            const [genreRows] = await pool.query(
                'SELECT g.name FROM genres g JOIN movie_genres mg ON g.name = mg.genre_name WHERE mg.movie_id = ?',
                [movie.id]
            ) as any[];
            movie.genres = genreRows.map((row: any) => row.name);
        }

        res.json(movies);
    } catch (error) {
        console.error('Ошибка при получении топ-10 фильмов:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

export const getByGenre = async (req: Request, res: Response) => {
    try {
        const genre = req.query.genre as string;

        if (!genre) {
            return res.status(400).json({ error: 'Не указан жанр' });
        }

        const [movies] = await pool.query(`
            SELECT
                m.id, m.title, m.posterUrl, m.tmdbRating, m.releaseYear,
                m.runtime, m.plot, m.backdropUrl, m.language,
                m.budget, m.revenue, m.director, m.production, m.awardsSummary,
                m.videoUrl
            FROM movies m
            JOIN movie_genres mg ON m.id = mg.movie_id
            WHERE mg.genre_name = ?
        `, [genre]) as any[];

        if (!movies || movies.length === 0) {
            return res.status(404).json({ error: 'Фильмы по данному жанру не найдены' });
        }

        for (const movie of movies) {
            const [genreRows] = await pool.query(
                'SELECT g.name FROM genres g JOIN movie_genres mg ON g.name = mg.genre_name WHERE mg.movie_id = ?',
                [movie.id]
            ) as any[];
            movie.genres = genreRows.map((row: any) => row.name);
        }

        res.json(movies);
    } catch (error) {
        console.error('Ошибка при получении фильмов по жанру:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

export const getById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);

        if (isNaN(id)) {
            return res.status(400).json({ error: 'Неверный ID фильма' });
        }

        const [movies] = await pool.query(`
            SELECT
                id, title, posterUrl, tmdbRating, releaseYear,
                runtime, plot, backdropUrl, language,
                budget, revenue, director, production, awardsSummary,
                videoUrl
            FROM movies
            WHERE id = ?
        `, [id]) as any[];

        if (!movies || movies.length === 0) {
            return res.status(404).json({ error: 'Фильм не найден' });
        }

        const movie = movies[0];

        const [genreRows] = await pool.query(
            'SELECT g.name FROM genres g JOIN movie_genres mg ON g.name = mg.genre_name WHERE mg.movie_id = ?',
            [id]
        ) as any[];

        movie.genres = genreRows.map((row: any) => row.name);

        res.json(movie);
    } catch (error) {
        console.error('Ошибка при получении фильма по ID:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

export const getCurrentWeek = async (req: Request, res: Response) => {
    try {
        const [movies] = await pool.query(`
            SELECT
                m.id, m.title, m.posterUrl, m.tmdbRating, m.releaseYear,
                m.runtime, m.plot, m.backdropUrl, m.language,
                m.budget, m.revenue, m.director, m.production, m.awardsSummary,
                m.videoUrl
            FROM movies m
            JOIN currentWeek cw ON m.id = cw.movie_id
            WHERE CURDATE() BETWEEN cw.week_start AND cw.week_end
            ORDER BY cw.position
        `) as any[];

        if (!movies || movies.length === 0) {
            return res.status(404).json({ error: 'Фильмы текущей недели не найдены' });
        }

        for (const movie of movies) {
            const [genreRows] = await pool.query(
                'SELECT g.name FROM genres g JOIN movie_genres mg ON g.name = mg.genre_name WHERE mg.movie_id = ?',
                [movie.id]
            ) as any[];
            movie.genres = genreRows.map((row: any) => row.name);
        }

        res.json(movies);
    } catch (error) {
        console.error('Ошибка при получении фильмов текущей недели:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};
