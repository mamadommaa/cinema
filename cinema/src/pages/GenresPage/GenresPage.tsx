import { useEffect } from 'react';
import styles from './GenresPage.module.css'
import { Title } from "../../components/Title/Title"
import { NavLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchGenres } from '../../store/moviesSlice';


import img1 from './images/genres1.jpg';
import img2 from './images/genres2.jpg';
import img3 from './images/genres3.jpg';
import img4 from './images/genres4.jpg';
import img5 from './images/genres5.jpg';
import img6 from './images/genres6.jpg';
import img7 from './images/genres7.jpg';
import img8 from './images/genres8.jpg';
import { SocialMedia } from '../../components/SocialMedia/Socialmedia';


const images = [img1, img2, img3, img4, img5, img6, img7, img8];

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
            <Title className={styles.genresTitle}>Жанры фильмов</Title>
            <div className={styles.genresWrapper}>
                {genres.map((genre, index) => (
                    <NavLink
                        key={genre}
                        to={`/genres/${genre}`}
                        className={styles.genresItem}
                    >
                        <img
                            src={images[index % images.length]}
                            alt={genre}
                        />
                        <h2 className={styles.genresItemTitle}>
                            {genre.charAt(0).toUpperCase() + genre.slice(1)}
                        </h2>
                    </NavLink>
                ))}
            </div>
            <SocialMedia />
        </div>
    );
};
