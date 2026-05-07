import styles from './QuizModal.module.css';

interface QuizModalProps {
    onClose: () => void;
    movieTitle: string;
}

export const QuizModal = ({ onClose, movieTitle }: QuizModalProps) => {
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>✕</button>
                <h2 className={styles.title}> Квиз: {movieTitle}</h2>
                <div className={styles.quizContent}>
                    <p className={styles.placeholder}>Викторина скоро появится!</p>
                </div>
            </div>
        </div>
    );
};
