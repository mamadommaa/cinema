

import { NavLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { openAuthModal } from '../../store/authSlice';
import { Button } from '../Button/Button';
import { SearchList } from '../SearchList/SearchList';
import styles from './Header.module.css'
import { useState } from 'react';

export const Header = () => {
    const dispatch = useAppDispatch();
    const { user, isAuthenticated } = useAppSelector(state => state.user);
    const [query, setQuery] = useState('');

    return (
        <div className={styles.header}>
            <div className={styles.headerWrapper}>
                <NavLink to="/home">
                    <img src="/logo.png" className={styles.headerLogo} alt="" />
                </NavLink>
                <div className={styles.headerBlackWrapper}>
                    <NavLink to="/home" className={styles.headerLink}>Главная</NavLink>
                    <NavLink to="/events" className={styles.headerLink}>Мероприятия</NavLink>
                    <NavLink to="/shanti" className={styles.headerLink}>Шанти</NavLink>
                    <NavLink to="/genres" className={styles.headerLink}>Жанры</NavLink>
                    <div className={styles.headerCustomInput}>
                        <input
                            className={styles.headerInput}
                            type="text"
                            placeholder="Поиск"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <img className={styles.headerSearchIcon} src="/header-search.png" alt="" />
                        <SearchList query={query} />
                    </div>
                </div>
                {isAuthenticated ? (
                    <NavLink to="/account">
                        <Button variant='transparent-black'>
                            {user?.firstName || 'Профиль'}
                        </Button>
                    </NavLink>
                ) : (
                    <Button
                        onClick={() => dispatch(openAuthModal())}
                        variant='transparent-black'>
                        Войти
                    </Button>
                )}
            </div>
        </div>
    )
}
