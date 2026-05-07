import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchMoviesByGenre } from '../../store/moviesSlice';
import { MovieGrid } from '../../components/MovieGrid/MovieGrid';
import styles from './GenrePage.module.css';

export const GenrePage = () => {
    const { genre } = useParams<{ genre: string }>();
    const dispatch = useAppDispatch();

    const { data: movies, loading, error } = useAppSelector(state => state.movies.moviesByGenre);

    useEffect(() => {
        if (genre) {
            dispatch(fetchMoviesByGenre(genre));
        }
    }, [genre, dispatch]);

    if (loading) return <div className={styles.loading}>Загрузка фильмов...</div>;
    if (error) return <div className={styles.error}>Ошибка: {error}</div>;

    return (
        <div className={styles.genrePage}>
            <h1 className={styles.genreTitle}>
                {genre ? genre.charAt(0).toUpperCase() + genre.slice(1) : ''}
            </h1>
            <MovieGrid
                movies={movies}
                showRank={false}
                className={styles.moviesGrid}
            />
        </div>
    );
};
