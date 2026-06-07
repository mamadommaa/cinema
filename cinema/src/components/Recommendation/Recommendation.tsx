import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchLastWatched, fetchRecommended } from '../../store/recommendationsSlice';
import { MovieGrid } from '../MovieGrid/MovieGrid';
import styles from './Recommendation.module.css';

export const Recommendation = () => {
    const dispatch = useAppDispatch();
    const { lastWatched, recommended, loading, error } = useAppSelector(state => state.recommendations);

    useEffect(() => {
        dispatch(fetchLastWatched());
        dispatch(fetchRecommended());
    }, [dispatch]);

    if (loading) return <div className={styles.loading}>Загрузка рекомендаций...</div>;
    if (error) return <div className={styles.error}>Ошибка: {error}</div>;

    return (
        <div className={styles.recommendationsWidget}>
            {recommended.length > 0 && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        ШАНТИ РЕКОМЕНДУЕТ
                    </h3>
                    <p className={styles.descr}>Мы посмотрели, что ты любишь, и выбрали для тебя самое близкое по духу. Смотри фильмы из нашей подборки по твоим любимым жанрам!</p>
                    <MovieGrid movies={recommended} showRank={false} darkText={false} />
                </div>
            )}
            {lastWatched.length > 0 && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>НЕДАВНО СМОТРЕЛИ</h3>
                    <MovieGrid movies={lastWatched} showRank={false} darkText={false} />
                </div>
            )}


        </div>
    );
};
