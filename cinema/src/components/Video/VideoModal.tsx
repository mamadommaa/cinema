import { useEffect, useRef } from 'react';
import styles from './VideoModal.module.css';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateWatchProgress } from '../../store/watchProgress';

interface VideoModalProps {
    videoUrl: string | null | undefined;
    movieId?: number;
    startTime?: number;
    onClose: () => void;
}
export const VideoModal = ({ videoUrl, movieId, onClose, startTime }: VideoModalProps) => {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector(state => state.user);
    const videoRef = useRef<HTMLVideoElement>(null);
    const lastSentRef = useRef<number>(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const sendProgress = (progress: number) => {
        if (isAuthenticated && movieId && Math.abs(progress - lastSentRef.current) >= 5) {
            lastSentRef.current = progress;
            dispatch(updateWatchProgress({ movieId, progress }));
        }
    };

    const handleTimeUpdate = () => {
        if (!videoRef.current || !isAuthenticated || !movieId) return;
        const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
        sendProgress(Math.min(progress, 100));
    };

    const handleEnded = () => {
        if (isAuthenticated && movieId) {
            dispatch(updateWatchProgress({ movieId, progress: 100 }));
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
    };

    useEffect(() => {
        if (!isAuthenticated || !movieId) return;
        intervalRef.current = setInterval(() => {
            if (videoRef.current && videoRef.current.duration) {
                const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
                if (progress >= 95) {
                    dispatch(updateWatchProgress({ movieId, progress: 100 }));
                    if (intervalRef.current) clearInterval(intervalRef.current);
                }
            }
        }, 10000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isAuthenticated, movieId, dispatch]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current && startTime && startTime > 0) {
            const duration = videoRef.current.duration;
            if (startTime < duration) {
                videoRef.current.currentTime = startTime;
            }
        }
    };

    return (
        <div className={styles.overlay} onClick={handleBackdropClick}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>✕</button>
                <div className={styles.videoContainer}>
                    {videoUrl ? (
                        <video
                            ref={videoRef}
                            className={styles.video}
                            src={videoUrl}
                            controls
                            autoPlay
                            width="100%"
                            height="100%"
                            onTimeUpdate={handleTimeUpdate}
                            onEnded={handleEnded}
                            onLoadedMetadata={handleLoadedMetadata}
                        />
                    ) : (
                        <div className={styles.placeholder}>
                            Видео пока нет :(
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
