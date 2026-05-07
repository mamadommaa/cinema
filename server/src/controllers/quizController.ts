import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getQuizByMovieId = async (req: Request, res: Response) => {
    try {
        const movieIdParam = req.params.movieId;
        const movieId = typeof movieIdParam === 'string' ? parseInt(movieIdParam) : NaN;

        if (isNaN(movieId)) {
            return res.status(400).json({ error: 'Неверный ID фильма' });
        }

        const [quizRows] = await pool.query(
            `SELECT id, title FROM quiz WHERE movie_id = ?`,
            [movieId]
        ) as any[];

        if (quizRows.length === 0) {
            return res.status(404).json({ error: 'Викторина для этого фильма не найдена' });
        }

        const quiz = quizRows[0];

        const [questionsRows] = await pool.query(
            `SELECT id, question_text, sort_order
             FROM quiz_questions
             WHERE quiz_id = ?
             ORDER BY sort_order`,
            [quiz.id]
        ) as any[];

        for (const question of questionsRows) {
            const [optionsRows] = await pool.query(
                `SELECT id, option_text
                 FROM quiz_options
                 WHERE question_id = ?`,
                [question.id]
            ) as any[];
            question.options = optionsRows;
        }

        quiz.questions = questionsRows;
        res.json(quiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

export const submitQuizResult = async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Не авторизован' });
        }

        const { quizId, score, totalQuestions } = req.body;
        if (!quizId || score === undefined || !totalQuestions) {
            return res.status(400).json({ error: 'Неверные данные' });
        }

        const passed = score === totalQuestions;

        await pool.query(
            `INSERT INTO user_quiz_results (user_id, quiz_id, score, passed)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
             score = VALUES(score),
             passed = VALUES(passed),
             completed_at = CURRENT_TIMESTAMP`,
            [userId, quizId, score, passed]
        );

        res.json({ message: 'Результат сохранён', passed, score });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};
