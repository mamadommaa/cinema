import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styles from './AuthModal.module.css';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { registerUser, clearRegistrationSuccess } from '../../store/userSlice';
import { Button } from '../Button/Button';
import { useEffect } from 'react';

const registerSchema = z.object({
    email: z.string().email('Некорректный email'),
    firstName: z.string().min(2, 'Имя должно быть минимум 2 символа'),
    lastName: z.string().min(2, 'Фамилия должна быть минимум 2 символа'),
    password: z.string().min(6, 'Пароль должен быть минимум 6 символов'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
    const dispatch = useAppDispatch();
    const { loading, error, registrationSuccess } = useAppSelector(state => state.user);
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    useEffect(() => {
        return () => {
            dispatch(clearRegistrationSuccess());
        };
    }, [dispatch]);

    const onSubmit = (data: RegisterFormData) => {
        const { confirmPassword, ...userData } = data;
        dispatch(registerUser(userData));
    };

    if (registrationSuccess) {
        return (
            <div className={styles.successMessage}>
                <p>Регистрация прошла успешно!</p>
                <p className={styles.successNote}>Теперь вы можете войти, используя свой email и пароль.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.modalForm}>
            {error && <div className={styles.errorMessage}> {error}</div>}

            <div className={styles.modalCustomInput}>
                <input
                    className={`${styles.modalInput} ${errors.email ? styles.error : ''}`}
                    type="email"
                    placeholder='Электронная почта'
                    {...register('email')}
                    disabled={loading}
                />
                <img className={styles.modalInputIcon} src="/email.svg" alt="" />
                {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
            </div>

            <div className={styles.modalCustomInput}>
                <input
                    className={`${styles.modalInput} ${errors.firstName ? styles.error : ''}`}
                    type="text"
                    placeholder='Имя'
                    {...register('firstName')}
                    disabled={loading}
                />
                <img className={styles.modalInputIcon} src="/user.svg" alt="" />
                {errors.firstName && <span className={styles.errorText}>{errors.firstName.message}</span>}
            </div>

            <div className={styles.modalCustomInput}>
                <input
                    className={`${styles.modalInput} ${errors.lastName ? styles.error : ''}`}
                    type="text"
                    placeholder='Фамилия'
                    {...register('lastName')}
                    disabled={loading}
                />
                <img className={styles.modalInputIcon} src="/user.svg" alt="" />
                {errors.lastName && <span className={styles.errorText}>{errors.lastName.message}</span>}
            </div>

            <div className={styles.modalCustomInput}>
                <input
                    className={`${styles.modalInput} ${errors.password ? styles.error : ''}`}
                    type="password"
                    placeholder='Пароль'
                    {...register('password')}
                    disabled={loading}
                />
                <img className={styles.modalInputIcon} src="/key.svg" alt="" />
                {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
            </div>

            <div className={styles.modalCustomInput}>
                <input
                    className={`${styles.modalInput} ${errors.confirmPassword ? styles.error : ''}`}
                    type="password"
                    placeholder='Подтвердите пароль'
                    {...register('confirmPassword')}
                    disabled={loading}
                />
                <img className={styles.modalInputIcon} src="/key.svg" alt="" />
                {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword.message}</span>}
            </div>

            <Button
                type="submit"
                variant='blue'
                className={styles.modalButton}
                disabled={loading}
            >
                {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>

            {loading && <div className={styles.loadingMessage}>⏳ Создание аккаунта...</div>}
        </form>
    );
};
