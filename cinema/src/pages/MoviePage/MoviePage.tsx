import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Banner } from '../../components/Banner/Banner';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchMovieById } from '../../store/moviesSlice';
import { fetchWatchProgress } from '../../store/watchProgress';
import styles from './MoviePage.module.css';
import { QuizModal } from '../../components/QuizModal/QuizModal';

export const MoviePage = () => {
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const { movieId } = useParams();
    const id = movieId ? parseInt(movieId, 10) : undefined;
    const dispatch = useAppDispatch();

    const { isAuthenticated } = useAppSelector(state => state.user);
    const { data: movie, loading, error } = useAppSelector(state => state.movies.current);
    const watchProgress = useAppSelector(state => state.watchProgress.items);

    const currentProgress = watchProgress.find(item => item.movieId === id)?.progress || 0;

    useEffect(() => {
        if (id) {
            dispatch(fetchMovieById(id));
            if (isAuthenticated) {
                dispatch(fetchWatchProgress());
            }
        }
    }, [id, dispatch, isAuthenticated]);


    const runtimeSeconds = (movie?.runtime || 0) * 60;
    let startTime = Math.floor((currentProgress / 100) * runtimeSeconds);
    console.log(startTime)
    if (isNaN(startTime) || startTime < 0) startTime = 0;

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;
    if (!movie) return <div>Фильм не найден</div>;

    return (
        <div className={styles.moviePage}>
            { }
            <Banner movie={movie} showExtra={false} startTime={startTime} />
            <h2 className={styles.moviePageTitle}>О фильме</h2>
            <div className={styles.moviePageContent}>
                <div className={styles.moviePageLeft}>
                    <div className={styles.moviePageGrid}>
                        <div className={styles.moviePageRow}>
                            <div className={styles.moviePageHeader}>Язык оригинала</div>
                            <div className={styles.moviePageValue}>{movie.language || '—'}</div>
                        </div>
                        <div className={styles.moviePageRow}>
                            <div className={styles.moviePageHeader}>Бюджет</div>
                            <div className={styles.moviePageValue}>{movie.budget ? `${movie.budget} $` : '—'}</div>
                        </div>
                        <div className={styles.moviePageRow}>
                            <div className={styles.moviePageHeader}>Выручка</div>
                            <div className={styles.moviePageValue}>{movie.revenue ? `${movie.revenue} $` : '—'}</div>
                        </div>
                        <div className={styles.moviePageRow}>
                            <div className={styles.moviePageHeader}>Режиссёр</div>
                            <div className={styles.moviePageValue}>{movie.director || '—'}</div>
                        </div>
                        <div className={styles.moviePageRow}>
                            <div className={styles.moviePageHeader}>Продакшен</div>
                            <div className={styles.moviePageValue}>{movie.production || '—'}</div>
                        </div>
                        <div className={styles.moviePageRow}>
                            <div className={styles.moviePageHeader}>Награды</div>
                            <div className={styles.moviePageValue}>{movie.awardsSummary || '—'}</div>
                        </div>
                    </div>
                </div>

                <div className={styles.moviePageRight}>
                    <div className={styles.progressCard}>
                        <div className={styles.progressTitle}>Прогресс просмотра</div>
                        <div className={styles.progressContainer}>
                            <div className={styles.progressBarWrapper}>
                                <div
                                    className={styles.progressFill}
                                    style={{ width: `${currentProgress}%` }}
                                />
                            </div>
                            <div className={styles.progressStats}>
                                <span className={styles.progressLabel}>Просмотрено</span>
                                <span className={styles.progressPercent}>{Math.round(currentProgress)}%</span>
                            </div>
                        </div>
                        {!isAuthenticated && (
                            <p className={styles.progressNote}>Войдите, чтобы сохранить прогресс</p>
                        )}
                    </div>
                    <button onClick={() => setIsQuizOpen(true)} className={styles.quizButton}>
                        🎮 Пройти викторину
                    </button>
                    {isQuizOpen && (
                        <QuizModal
                            movieTitle={movie.title}
                            onClose={() => setIsQuizOpen(false)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
