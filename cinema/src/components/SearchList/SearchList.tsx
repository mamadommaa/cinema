import { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { searchMovies, clearSearch } from '../../store/moviesSlice';
import styles from './SearchList.module.css';

interface SearchListProps {
    query: string;
}

export const SearchList = ({ query }: SearchListProps) => {
    const [showResults, setShowResults] = useState(false);
    const dispatch = useAppDispatch();
    const { results, loading, error } = useAppSelector(state => state.movies.search);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (query.length >= 2) {
            const timer = setTimeout(() => {
                dispatch(searchMovies(query));
                setShowResults(true);
            }, 500);
            return () => clearTimeout(timer);
        } else {
            dispatch(clearSearch());
            setShowResults(false);
        }
    }, [query, dispatch]);

    return (
        <>
            {showResults && (
                <div className={styles.resultsList} ref={searchRef}>
                    {loading && (
                        <div className={styles.resultItem}>
                            <span className={styles.loadingText}>Поиск...</span>
                        </div>
                    )}

                    {!loading && error && (
                        <div className={styles.resultItem}>
                            <span className={styles.errorText}>⚠️ {error}</span>
                        </div>
                    )}

                    {!loading && !error && results.length === 0 && query.length >= 2 && (
                        <div className={styles.resultItem}>
                            <span className={styles.emptyText}>😔 Ничего не найдено</span>
                        </div>
                    )}

                    {!loading && !error && results.map((movie) => (
                        <NavLink
                            key={movie.id}
                            to={`/movie/${movie.id}`}
                            className={styles.resultItem}
                            onClick={() => setShowResults(false)}
                        >
                            <div className={styles.movieInfo}>
                                {movie.posterUrl ? (
                                    <img
                                        src={movie.posterUrl}
                                        alt={movie.title}
                                        className={styles.moviePoster}
                                    />
                                ) : (
                                    <div className={styles.moviePosterPlaceholder}>🎬</div>
                                )}
                                <div className={styles.movieDetails}>
                                    <span className={styles.movieTitle}>{movie.title}</span>
                                    {movie.releaseYear && (
                                        <span className={styles.movieYear}>({movie.releaseYear})</span>
                                    )}
                                </div>
                            </div>
                        </NavLink>
                    ))}
                </div>
            )}
        </>
    );
};
