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
            {lastWatched.length > 0 && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>НЕДАВНО СМОТРЕЛИ</h3>
                    <MovieGrid movies={lastWatched} showRank={false} darkText={false} />
                </div>
            )}

            {recommended.length > 0 && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        Наша рекомендация на основе ваших предпочтений
                    </h3>
                    <MovieGrid movies={recommended} showRank={false} darkText={false} />
                </div>
            )}
        </div>
    );
};
