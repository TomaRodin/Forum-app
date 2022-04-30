import Router from 'next/router'
import styles from '../../../../styles/Styles.module.css'
import Cookie from 'universal-cookie'
import axios from 'axios'

export default function Comment(props) {

    function Push() {
        Router.push('/home/users/'+props.data.userID)
    }

    function Delete() {
        axios.delete('http://localhost:3001/answer', {
            data: {id: props.data.questionID}
        })
        .then(response => {
            if (response.data.success) {
                window.location.reload();
            }
        })
    }

    const cookie = new Cookie();

    if (Number(cookie.get('ID')) === props.data.userID && cookie.get('LoggedIn') === props.data.username) {
        return (
            <div className={styles.Comment} >
                <a onClick={Push}><h4>{props.data.username}</h4></a>
                <p>{props.data.answer}</p>
                <button onClick={Delete}>Delete</button>
            </div>	
        )
    }
    else {
        return (
            <div className={styles.Comment} >
                <a onClick={Push}><h4>{props.data.username}</h4></a>
                <p>{props.data.answer}</p>
            </div>
        )
    }
}