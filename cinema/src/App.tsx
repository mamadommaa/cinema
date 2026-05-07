import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header/Header.js';
import { AuthModal } from './components/AuthModal/AuthModal.js';
import { HomePage } from './pages/HomePage/HomePage.tsx';
import { GenresPage } from './pages/GenresPage/GenresPage.tsx';
import { MoviePage } from './pages/MoviePage/MoviePage.tsx';
import { GenrePage } from './pages/GenrePage/GenrePage.tsx';
import { AccountPage } from './pages/AccountPage/AccountPage.tsx';
import { ShantiPage } from './pages/ShantiPage/ShantiPage.tsx'
import { EventsPage } from './pages/EventsPage/EventsPage.tsx';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { fetchProfile } from './store/userSlice';
import styles from './App.module.css';

const App = () => {
    const isAuthModalOpen = useAppSelector(state => state.auth.isModalOpen);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchProfile()).catch(() => {
        });
    }, [dispatch]);

    return (
        <div className={styles.app}>
            <Header />
            <div className={styles.appContainer}>
                {isAuthModalOpen && <AuthModal />}
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/genres" element={<GenresPage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/movie/:movieId" element={<MoviePage />} />
                    <Route path="/genres/:genre" element={<GenrePage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/shanti" element={<ShantiPage />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
