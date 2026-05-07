import styles from './SocialMedia.module.css'

export const SocialMedia = () => {
    return (
        <div className={styles.socialMedia} >
            <a href="#">
                <img src="/vk.svg" alt="ВКонтакте" />
            </a>
            <a href="#">
                <img src="/youtube.svg" alt="YouTube" />
            </a>
            <a href="#">
                <img src="/ok.svg" alt="Одноклассники" />
            </a>
            <a href="#">
                <img src="/telegram.svg" alt="Телеграм" />
            </a>
        </div >
    )
}
