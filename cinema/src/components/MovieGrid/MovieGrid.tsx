import { NavLink } from 'react-router-dom';
import styles from './MovieGrid.module.css';
import { Movie } from '../../store/moviesSlice';

interface MovieGridProps {
    movies: Movie[];
    showRank?: boolean;
    className?: string;
    darkText?: boolean;
}

export const MovieGrid = ({ movies, showRank = false, className, darkText = false }: MovieGridProps) => {
    return (
        <div className={`${styles.movieGrid} ${className || ''}`}>
            {movies.map((movie, index) => (
                <NavLink to={`/movie/${movie.id}`} key={movie.id} className={styles.movieCard}>
                    {showRank && <span className={styles.movieRank}>{index + 1}</span>}

                    {movie.posterUrl ? (
                        <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className={styles.moviePoster}
                        />
                    ) : (
                        <img src="/moviePosterLost.jpg" alt="" className={styles.moviePoster} />
                    )}
                    <h2 className={`${styles.movieTitle} ${darkText ? styles.darkTitle : ''}`}>
                        {movie.title}
                    </h2>
                </NavLink>
            ))}
        </div>
    );
};
