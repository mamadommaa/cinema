import { useEffect } from 'react';
import styles from './GenresPage.module.css'
import { Title } from "../../components/Title/Title"
import { NavLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchGenres } from '../../store/moviesSlice';

import img1 from './images/genres1.jpg';
// import img2 from './images/genres2.jpg';
import img3 from './images/genres3.jpg';
import img4 from './images/genres4.jpg';
// import img5 from './images/genres5.jpg';
import img6 from './images/genres6.jpg';
import img7 from './images/genres7.jpg';
import img8 from './images/genres8.jpg';
import { SocialMedia } from '../../components/SocialMedia/Socialmedia';

// Маппинг жанров на картинки
const genreImageMap: Record<string, string> = {
    action: img6,      // БОЕВИК
    adventure: img8,   // ПРИКЛЮЧЕНИЯ
    drama: img1,       // ДРАМА
    family: img3,      // СЕМЕЙНЫЙ
    fantasy: img4,     // ФЭНТЕЗИ
    scifi: img7        // ФАНТАСТИКА
};

// Словарь перевода жанров
const genreTranslations: Record<string, string> = {
    action: 'БОЕВИК',
    adventure: 'ПРИКЛЮЧЕНИЯ',
    drama: 'ДРАМА',
    family: 'СЕМЕЙНЫЙ',
    fantasy: 'ФЭНТЕЗИ',
    scifi: 'ФАНТАСТИКА'
};

const translateGenre = (engGenre: string): string => {
    return genreTranslations[engGenre.toLowerCase()] || engGenre.toUpperCase();
};

export const GenresPage = () => {
    const dispatch = useAppDispatch();
    const { data: genres, loading, error } = useAppSelector(state => state.movies.genres);
    console.log(genres);

    useEffect(() => {
        dispatch(fetchGenres());
    }, [dispatch]);

    if (loading) return <div>Загрузка жанров...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div className={styles.genresPage}>
            <img className={styles.shantiGenres} src="/shanti-genres.png" alt="" />
            <Title className={styles.genresTitle}>Жанры фильмов</Title>
            <div className={styles.genresWrapper}>
                {genres.map((genre) => (
                    <NavLink
                        key={genre}
                        to={`/genres/${genre}`}
                        className={styles.genresItem}
                    >
                        <img
                            src={genreImageMap[genre]}
                            alt={genre}
                        />
                        <h2 className={styles.genresItemTitle}>
                            {translateGenre(genre)}
                        </h2>
                    </NavLink>
                ))}
            </div>
            <SocialMedia />
        </div>
    );
};
