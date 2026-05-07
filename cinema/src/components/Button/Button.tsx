import styles from './Button.module.css'

type ButtonVariant = 'transparent-white' | 'blue' | 'grey' | 'dark' | 'transparent-black'

interface ButtonProps {
    onClick?: () => void;
    children: React.ReactNode;
    variant?: ButtonVariant;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
}

export const Button = ({
    onClick,
    children,
    variant = 'transparent-white',
    disabled = false,
    type = 'button',
    className = ''
}: ButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${styles.button} ${styles[`button--${variant}`]} ${className}`}
        >
            {children}
        </button>
    )
}
