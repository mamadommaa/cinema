import { Request, Response } from 'express';
import axios from 'axios';
import { pool } from '../config/db';

declare module 'express-session' {
    interface SessionData {
        chatHistory?: { role: 'user' | 'assistant'; content: string }[];
        lastRecommendations?: number[];
    }
}

interface MovieShort {
    id: number;
    title: string;
}

export const shantiChat = async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Не авторизован' });
        }

        const { message } = req.body;
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Неверный формат сообщения' });
        }

        if (!req.session.chatHistory) {
            req.session.chatHistory = [];
        }
        req.session.chatHistory.push({ role: 'user', content: message });
        if (req.session.chatHistory.length > 10) {
            req.session.chatHistory = req.session.chatHistory.slice(-10);
        }

        const apiKey = process.env.DEEPSEEK_API_KEY;
        if (!apiKey) {
            console.error("API ключ DeepSeek не найден!");
            return res.status(500).json({ error: 'Ошибка конфигурации сервера' });
        }

        const intentResponse = await axios.post(
            'https://api.deepseek.com/chat/completions',
            {
                model: "deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: `Ты классификатор запросов о кино.
Если пользователь просит порекомендовать фильм — напиши только слово RECOMMEND.
В остальных случаях отвечай как дружелюбный помощник Shanti.`
                    },
                    ...req.session.chatHistory
                ],
                stream: false,
                temperature: 0.1
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        const intent = intentResponse.data.choices[0].message.content;
        console.log('🤖 Intent:', intent);

        if (!intent.includes('RECOMMEND')) {
            req.session.chatHistory.push({ role: 'assistant', content: intent });
            return res.json({ reply: intent });
        }

        const [moviesRows] = await pool.query(
            `SELECT id, title FROM movies WHERE posterUrl IS NOT NULL LIMIT 30`
        ) as any[];

        const moviesList: MovieShort[] = moviesRows.map((m: any) => ({
            id: m.id,
            title: m.title
        }));

        const recommendResponse = await axios.post(
            'https://api.deepseek.com/chat/completions',
            {
                model: "deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: `Ты — эксперт по кино. Твоя задача — рекомендовать фильмы ТОЛЬКО из предоставленного списка.
Список фильмов: ${JSON.stringify(moviesList)}.
Верни строго JSON без лишних слов. Формат:
{"comment": "твой комментарий пользователю", "ids": [1, 2, 3]}
Comment должен быть кратким, на русском, объяснять выбор фильмов.`
                    },
                    {
                        role: "user",
                        content: `Пользователь хочет: "${message}"`
                    }
                ],
                stream: false,
                temperature: 0.3
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        const rawContent = recommendResponse.data.choices[0].message.content;
        console.log('📦 DeepSeek ответ (json):', rawContent);

        let result;
        try {
            const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error('JSON не найден');
            result = JSON.parse(jsonMatch[0]);
        } catch (e) {
            console.error(' Ошибка парсинга JSON, пробуем извлечь ids вручную');
            const idsMatch = rawContent.match(/ids["']?\s*:\s*\[([\d,\s]+)\]/);
            const ids = idsMatch ? idsMatch[1].split(',').map(Number) : [];
            result = {
                comment: "Вот что мне удалось найти:",
                ids: ids
            };
        }

        const recommendedIds: number[] = result.ids || [];
        const comment: string = result.comment || "Вот что мне удалось найти:";

        if (!recommendedIds.length) {
            const noResultReply = "К сожалению, не нашёл фильмов по твоему запросу.";
            req.session.chatHistory.push({ role: 'assistant', content: noResultReply });
            return res.json({ reply: noResultReply });
        }

        const placeholders = recommendedIds.map(() => '?').join(',');
        const [recommendedMovies] = await pool.query(
            `SELECT * FROM movies WHERE id IN (${placeholders})`,
            recommendedIds
        ) as any[];

        req.session.chatHistory.push({ role: 'assistant', content: comment });

        res.json({
            reply: comment,
            movies: recommendedMovies
        });

    } catch (error: any) {
        console.error('Ошибка в Shanti API:', error.response?.data || error.message);
        if (error.code === 'ECONNABORTED') {
            return res.status(504).json({ error: 'DeepSeek не отвечает, попробуй позже' });
        }
        res.status(500).json({ error: 'Ошибка сервера при запросе к ИИ' });
    }
};
