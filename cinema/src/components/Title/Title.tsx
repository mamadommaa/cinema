import styles from './Title.module.css'

interface TitleProps {
    children: React.ReactNode,
    className?: string
}
export const Title = ({ children, className }: TitleProps) => {
    return (
        <h1 className={`${styles.title} ${className}`}>{children}</h1>
    )
}
