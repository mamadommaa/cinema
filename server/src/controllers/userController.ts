import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../config/db';

declare module 'express-session' {
    interface SessionData {
        userId: number;
    }
}

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email и пароль обязательны' });
        }

        const [existing] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        ) as any[];

        if (existing.length > 0) {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            `INSERT INTO users (email, password, firstName, lastName)
             VALUES (?, ?, ?, ?)`,
            [email, hashedPassword, firstName || null, lastName || null]
        ) as any;

        req.session.userId = result.insertId;

        res.status(201).json({
            message: 'Регистрация прошла успешно',
            user: {
                email,
                firstName: firstName || null,
                lastName: lastName || null
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера при регистрации' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email и пароль обязательны' });
        }

        const [users] = await pool.query(
            'SELECT id, email, password, firstName, lastName FROM users WHERE email = ?',
            [email]
        ) as any[];

        if (users.length === 0) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        const user = users[0];

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        req.session.userId = user.id;

        res.status(200).json({
            message: 'Вход выполнен успешно',
            user: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера при входе' });
    }
};

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Не авторизован' });
        }

        const [users] = await pool.query(
            'SELECT id, email, firstName, lastName FROM users WHERE id = ?',
            [userId]
        ) as any[];

        if (users.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        const user = users[0];

        res.status(200).json({
            email: user.email,
            name: user.firstName,
            surname: user.lastName
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера при получении профиля' });
    }
};

export const logout = async (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка при выходе' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Выход выполнен успешно' });
    });
};
