import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import session from 'express-session';
import movieRoutes from './routes/movieRoutes';
import authRoutes from './routes/userRoutes';
import favoritesRoutes from './routes/favoritesRoutes';
import watchProgressRoutes from './routes/watchProgressRoutes';
import shantiRoutes from './routes/shantiRoutes';
import quizRoutes from './routes/quizRoutes';
import recommendationsRoutes from './routes/recommendationsRoutes';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(session({
    secret: process.env.SESSION_SECRET || 'my-super-secret-key-change-it',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'lax'
    }
}));

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

app.use('/api/movies', movieRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/watch-progress', watchProgressRoutes);
app.use('/api/shanti', shantiRoutes);
app.use('/api/quiz', quizRoutes);

app.use('/api/recommendations', recommendationsRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
