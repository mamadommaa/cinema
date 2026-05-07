import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styles from './AuthModal.module.css';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser } from '../../store/userSlice';
import { Button } from '../Button/Button';

const loginSchema = z.object({
    email: z.string().email('Некорректный email'),
    password: z.string().min(6, 'Пароль должен быть минимум 6 символов'),
});
console.log(loginSchema)
type LoginFormData = z.infer<typeof loginSchema>;


export const LoginForm = () => {
    const dispatch = useAppDispatch();
    const { loading, error, isAuthenticated } = useAppSelector(state => state.user);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginFormData) => {
        dispatch(loginUser(data));
    };

    if (isAuthenticated) {
        return (
            <p>Вы успешно вошли в систему!</p>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.modalForm}>
            {error && <div className={styles.errorMessage}>{error}</div>}

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
                    className={`${styles.modalInput} ${errors.password ? styles.error : ''}`}
                    type="password"
                    placeholder='Пароль'
                    {...register('password')}
                    disabled={loading}
                />
                <img className={styles.modalInputIcon} src="/key.svg" alt="" />
                {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
            </div>

            <Button
                type="submit"
                variant='blue'
                className={styles.modalButton}
                disabled={loading}
            >
                {loading ? 'Вход...' : 'Войти'}
            </Button>

            {loading && <div className={styles.loadingMessage}>⏳ Проверка данных...</div>}
        </form>
    );
};
