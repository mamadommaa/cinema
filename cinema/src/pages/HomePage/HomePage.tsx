import { useEffect } from 'react'
import { Banner } from '../../components/Banner/Banner'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchTop10, fetchRandom } from '../../store/moviesSlice'
import { MovieGrid } from '../../components/MovieGrid/MovieGrid'
import styles from './HomePage.module.css'
import { SocialMedia } from '../../components/SocialMedia/Socialmedia'

export const HomePage = () => {
    const dispatch = useAppDispatch()
    const { data: top10, loading, error } = useAppSelector(state => state.movies.top10)
    const randomMovie = useAppSelector(state => state.movies.random.data)

    useEffect(() => {
        dispatch(fetchTop10())
        dispatch(fetchRandom())
    }, [dispatch])

    return (
        <div className={styles.homePage}>
            <Banner movie={randomMovie} showExtra={true} />
            <div className={styles.topFilms}>
                <h2 className={styles.topFilmsTitle}>Топ-10 фильмов:</h2>

                {loading && <div>Загрузка...</div>}
                {error && <div>Ошибка: {error}</div>}

                {!loading && !error && (
                    <MovieGrid className={styles.topFilmsMovieGrid} movies={top10} showRank={true} />
                )}
                <SocialMedia />
            </div>
        </div>


    )
}
