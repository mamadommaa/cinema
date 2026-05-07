import { useState } from 'react';
import styles from './AuthModal.module.css';
import { useAppDispatch } from '../../store/hooks';
import { closeAuthModal } from '../../store/authSlice';
import { NavLink } from 'react-router-dom';
import { Button } from '../Button/Button';
import { RegisterForm } from './RegisterForm';
import { LoginForm } from './LoginForm';

export const AuthModal = () => {
    const dispatch = useAppDispatch();
    const [isLogin, setIsLogin] = useState(true);

    const handleClose = () => {
        dispatch(closeAuthModal());
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className={styles.overlay} >

            <div className={styles.modal} >
                <button onClick={handleClose} className={styles.modalButtonClose}>
                    <img src="/close.svg" alt="" />
                </button>

                <NavLink to="/home" className={styles.modalLogo}>
                    <img src="/logo-black.svg" alt="" />
                </NavLink>

                {isLogin ? <LoginForm /> : <RegisterForm />}
                <div className={styles.modalButtonWrapper}>
                    <Button
                        variant='transparent-black'
                        onClick={toggleMode}
                    >
                        {isLogin ? 'Регистрация' : 'У меня есть пароль'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
