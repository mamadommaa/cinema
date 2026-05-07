import { useState, useEffect } from 'react';
import styles from './EventsPage.module.css';
import { MovieGrid } from '../../components/MovieGrid/MovieGrid';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCurrentWeek } from '../../store/moviesSlice';

export const EventsPage = () => {
    const [backgroundLoaded, setBackgroundLoaded] = useState(false);
    const dispatch = useAppDispatch();
    const { data: currentWeek, loading, error } = useAppSelector(state => state.movies.currentWeek);

    useEffect(() => {
        const img = new Image();
        img.src = '/eventsBackground.jpg';
        img.onload = () => setBackgroundLoaded(true);
        dispatch(fetchCurrentWeek());
    }, [dispatch]);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div className={`${styles.events} ${backgroundLoaded ? styles.loaded : ''}`}>
            <div className={styles.eventsWrapper}>
                <h1 className={styles.eventsTitle}>week of</h1>
                <h2 className={styles.eventsSubTitle}>Древний Рим</h2>

                <section className={styles.eventsSection}>
                    <h3 className={styles.eventsSectionTitle}>Что вас ждёт?</h3>
                    <ul className={styles.eventList}>
                        <li className={styles.eventElement}>
                            <div className={styles.eventListTextWrapper}>
                                <img className={styles.glassNumber} src="/1.png" alt="" />
                                <h4 className={styles.eventElementTitle}>Античный банкет</h4>
                                <p className={styles.eventElementDescr}>Закуски, вино и атмосфера римского пира. Погружаемся в атмосферу римского застолья</p>
                            </div>
                            <img src="/events-list-1.jpg" alt="" />
                        </li>
                        <li className={styles.eventElement}>
                            <div className={styles.eventListTextWrapper}>
                                <img className={styles.glassNumber} src="/2.png" alt="" />
                                <h4 className={styles.eventElementTitle}>Костюмированный вход</h4>
                                <p className={styles.eventElementDescr}>Тога? Легионер? Весталка? Выбирай образ и получи бонусный бокал у входа.</p>
                            </div>
                            <img src="/events-list-2.jpg" alt="" />
                        </li>
                        <li className={styles.eventElement}>
                            <div className={styles.eventListTextWrapper}>
                                <img className={styles.glassNumber} src="/3.png" alt="" />
                                <h4 className={styles.eventElementTitle}>Секретный фильм!</h4>
                                <p className={styles.eventElementDescr}>Легендарный фильм о Древнем Риме на большом экране. Только для участников вечера!</p>
                            </div>
                            <img src="/events-list-3.jpg" alt="" />
                        </li>
                    </ul>
                    <div className={styles.eventDescr}>
                        Смотри фильмы о <span className={styles.marker}>Древнем Риме</span>, погружайся в эпоху и получи
                        <span className={styles.marker}> скидку</span> на наш
                        <span className={styles.marker}> закрытый показ и квиз</span> в атмосфере античности!
                        Победителей в квизе ждут <span className={styles.marker}>щедрые призы</span>!
                    </div>
                </section>

                <section className={styles.eventsSection}>
                    <h3 className={styles.eventsSectionTitle}>Фильмы этой недели</h3>
                    <MovieGrid showRank={true} movies={currentWeek} darkText={true} />
                    <div className={styles.filmsDescrWrapper}>
                        <img className={styles.filmsImg} src="/present.png" alt="" />
                        <p className={styles.filmsDescr}>
                            Успешно заверши викторины по
                            <span className={styles.marker}> 3 фильмам текущей подборки</span> и получи
                            <span className={styles.marker}> промокод на скидку 50%</span> на закрытое мероприятие этой недели!
                        </p>
                    </div>
                </section>
                <section className={`${styles.eventsSection} ${styles.bid}`}>
                    <h3 className={styles.eventsSectionTitle}>Хочешь стать частю вечера ?</h3>
                    <p className={styles.bidDescr}>
                        Оставь заявку — и мы пришлём программу и детали мероприятия!
                    </p>
                    <div className={styles.bidCard}>

                    </div>
                </section>
            </div>
        </div>
    );
};
