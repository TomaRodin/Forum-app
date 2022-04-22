import Navbar from '../../layout/Navbar'
import styles from '../../../styles/Styles.module.css'
import axios from 'axios';
import { useRef, useEffect, useState } from 'react';
import Cookie from 'universal-cookie'
import Notification from './components/Notification'
import Router from 'next/router'

export default function Home() {

    const title = useRef();
    const text = useRef();
    const [Note, setNote] = useState();


    const cookie = new Cookie();

    useEffect(() => {
        if (cookie.get('LoggedIn') === undefined) {
            Router.push('/login')
        }
    }, [])

    async function ShowNotification() {
        setNote(<Notification />)

        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(2000)

        Router.push('/home')
    }

    function handleSubmit(e) {
        e.preventDefault()

        class Data {
            constructor(name, title, text) {
                this.name = name
                this.title = title
                this.text = text
            }
        }

        const data = new Data(cookie.get('LoggedIn'), title.current.value, text.current.value)
    

        axios.post('http://localhost:3001/', data)
        .then(response => {
            if (response.data.success === true) {
                ShowNotification();
            }
        })

    }

    return (
        <div>
            <Navbar />

            <div className={styles.centerContainer}>
                <h1>Add</h1>
                <form onSubmit={handleSubmit}>
                    <h3>Title:</h3>
                    <input ref={title} />
                    <br />
                    <h3>Description:</h3>
                    <textarea ref={text} />
                    <br />
                    <button>Add</button>
                </form>
            </div>

            {Note}
        </div>
    )
}