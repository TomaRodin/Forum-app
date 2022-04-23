import styles from '../../../../styles/Styles.module.css'

export default function Question(props) {

    const link = `http://localhost:3000/home/question/${props.data.id}`

    return (
        <div className={styles.QuestionSearch} key={props.data.id}>
            <a href={link}>{props.data.title}</a>
            <p>{props.data.text}</p>
            <p>Author: {props.data.username}</p>
        </div>
    )
}