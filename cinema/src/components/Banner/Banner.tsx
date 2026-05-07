import styles from './Banner.module.css'
import { Button } from '../Button/Button'
import { Title } from '../Title/Title'
import { NavLink } from 'react-router-dom'
import { Movie } from '../../store/moviesSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { addFavorite } from '../../store/favoritesSlice'
import { openAuthModal } from '../../store/authSlice'
import { useState } from 'react'
import { VideoModal } from '../Video/VideoModal'

interface BannerProps {
    movie: Movie | null;
    showExtra?: boolean;
    startTime?: number;
}

export const Banner = ({ movie, showExtra = false, startTime }: BannerProps) => {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector(state => state.user);
    const { addingId } = useAppSelector(state => state.favorites);
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    const handleFavoriteClick = async () => {
        if (!isAuthenticated) {
            dispatch(openAuthModal());
            return;
        }
        if (!movie) return;
        try {
            await dispatch(addFavorite(movie.id)).unwrap();
        } catch (error) {
            console.error(error);
        }
    };

    const getRatingColor = (rating: number) => {
        if (rating <= 4.2) return '#C82020';
        if (rating <= 6.3) return '#777777';
        if (rating <= 7.5) return '#308E21';
        return '#55a500ff';
    };

    if (!movie) return <div>Нет данных</div>;

    return (
        <>
            <div className={styles.banner}>
                <div className={styles.bannerInfo}>
                    <div className={styles.bannerMetaWrapper}>
                        <div
                            className={styles.bannerRating}
                            style={{ backgroundColor: getRatingColor(movie.tmdbRating) }}
                        >
                            <img src="/star.svg" alt="" />
                            <span>{Number(movie.tmdbRating)?.toFixed(1)}</span>
                        </div>
                        <span>{movie.releaseYear}</span>
                        <span>{movie.genres?.[0]}</span>
                        <span>{movie.runtime} мин</span>
                    </div>
                    <Title className={styles.bannerTitle}>{movie.title}</Title>
                    <p className={styles.bannerDescr}>{movie.plot}</p>
                    <div className={styles.bannerInteractive}>
                        <Button variant='blue' onClick={() => setIsVideoOpen(true)}>Смотреть</Button>

                        {showExtra && (
                            <>
                                <NavLink to={`/movie/${movie.id}`}>
                                    <Button variant='grey'>О фильме</Button>
                                </NavLink>
                                <Button variant='dark'><img src="/update.svg" alt="" /></Button>
                            </>
                        )}

                        <Button
                            variant='dark'
                            onClick={handleFavoriteClick}
                            disabled={addingId === movie.id}
                        >
                            <img src="/favorites.svg" alt="" />
                        </Button>
                    </div>
                </div>
                <img
                    className={styles.bannerImg}
                    src={movie.backdropUrl ?? movie.posterUrl ?? '/placeholder.jpg'}
                    alt={movie.title}
                />
            </div>

            {isVideoOpen && (
                <VideoModal
                    videoUrl={movie.videoUrl}
                    movieId={movie.id}
                    startTime={startTime}
                    onClose={() => setIsVideoOpen(false)}
                />
            )}
        </>
    );
};
