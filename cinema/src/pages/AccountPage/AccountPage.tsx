import { useEffect, useState } from 'react';
import { MovieGrid } from '../../components/MovieGrid/MovieGrid';
import { Title } from "../../components/Title/Title"
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchFavorites, removeFavorite } from '../../store/favoritesSlice';
import { logoutUser } from '../../store/userSlice';
import { useNavigate } from 'react-router-dom';
import styles from './AccountPage.module.css';
import { Recommendation } from '../../components/Recommendation/Recommendation';

export const AccountPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { items: favorites, loading, error, addingId } = useAppSelector(state => state.favorites);
    const { user } = useAppSelector(state => state.user);

    const [activeTab, setActiveTab] = useState<'favorites' | 'settings'>('favorites');

    useEffect(() => {
        dispatch(fetchFavorites());
    }, [dispatch]);

    const handleRemoveFavorite = (movieId: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(removeFavorite(movieId));
    };

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            navigate('/home');
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    };

    if (loading && activeTab === 'favorites') return <div className={styles.loading}>Загрузка избранного...</div>;
    if (error && activeTab === 'favorites') return <div className={styles.error}>Ошибка: {error}</div>;

    return (
        <div className={styles.accountPage}>
            <Title className={styles.accountTitle}>Мой аккаунт</Title>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'favorites' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('favorites')}
                >
                    Подборка
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'settings' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    Настройки аккаунта
                </button>
            </div>

            {activeTab === 'favorites' ? (
                <div className={styles.favoritesSection}>
                    <Recommendation />

                    <h2 className={styles.title}>ИЗБРАННОЕ</h2>

                    {favorites.length === 0 ? (
                        <p>У вас пока нет избранных фильмов</p>
                    ) : (
                        <div className={styles.moviesGridWrapper}>
                            <MovieGrid movies={favorites} showRank={false} />
                            <div className={styles.removeButtonsContainer}>
                                {favorites.map(movie => (
                                    <button
                                        key={movie.id}
                                        className={styles.removeButton}
                                        onClick={(e) => handleRemoveFavorite(movie.id, e)}
                                        disabled={addingId === movie.id}
                                        style={{ position: 'absolute' }}
                                    >
                                        {addingId === movie.id ? '...' : '✕'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className={styles.settingsSection}>
                    <h2>Настройки аккаунта</h2>

                    <div className={styles.settingsCard}>
                        <div className={styles.settingsRow}>
                            <div className={styles.settingsLabel}>Имя</div>
                            <div className={styles.settingsValue}>{user?.firstName || '—'}</div>
                        </div>

                        <div className={styles.settingsRow}>
                            <div className={styles.settingsLabel}>Фамилия</div>
                            <div className={styles.settingsValue}>{user?.lastName || '—'}</div>
                        </div>

                        <div className={styles.settingsRow}>
                            <div className={styles.settingsLabel}>Электронная почта</div>
                            <div className={styles.settingsValue}>{user?.email || '—'}</div>
                        </div>

                        <button
                            className={styles.logoutButton}
                            onClick={handleLogout}
                        >
                            Выйти из аккаунта
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
