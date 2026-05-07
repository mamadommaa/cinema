import { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addUserMessage, sendToShanti } from '../../store/shantiSlice';
import { MovieGrid } from '../../components/MovieGrid/MovieGrid';
import styles from './Shanti.module.css';

export const ShantiPage = () => {
    const dispatch = useAppDispatch();
    const { messages, loading, error } = useAppSelector(state => state.shanti);
    const { isAuthenticated } = useAppSelector(state => state.user);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        dispatch(addUserMessage(input));
        setInput('');

        if (!isAuthenticated) return;

        try {
            await dispatch(sendToShanti(input)).unwrap();
        } catch (err) {
            console.error('Ошибка при отправке сообщения:', err);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.chat}>
                <div className={styles.messages} ref={messagesContainerRef}>
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`${styles.messageWrapper} ${styles[msg.sender + 'Wrapper']}`}
                        >
                            <div className={`${styles.message} ${styles[msg.sender]}`}>
                                {msg.text}
                            </div>
                            {msg.movies && msg.movies.length > 0 && (
                                <div className={styles.moviesContainer}>
                                    <MovieGrid
                                        movies={msg.movies}
                                        showRank={true}
                                        darkText={false}
                                        className={styles.customGrid}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                    {loading && <div className={styles.typing}>Shanti печатает...</div>}
                    {error && <div className={styles.error}>{error}</div>}
                    <div ref={messagesEndRef} />
                </div>

                <div className={styles.inputArea}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Спроси Shanti..."
                        disabled={!isAuthenticated}
                    />
                    <button onClick={sendMessage} disabled={!isAuthenticated}>
                        Отправить
                    </button>
                </div>
                {!isAuthenticated && (
                    <p className={styles.loginNote}>Войдите, чтобы общаться с Shanti</p>
                )}
            </div>
        </div>
    );
};
