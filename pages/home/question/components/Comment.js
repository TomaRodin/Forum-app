import styles from '../../../../styles/Styles.module.css'

export default function Comment(props) {
    return (
        <div className={styles.Comment} >
            <h4>{props.data.username}</h4>
            <p>{props.data.answer}</p>
        </div>
    )
}