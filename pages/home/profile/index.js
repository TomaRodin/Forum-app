import Image from 'next/image'
import Navbar from '../../layout/Navbar'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Cookie from 'universal-cookie'
import styles from '../../../styles/Styles.module.css'
import Router from 'next/router'

export default function Profile() {

    const [data, setData] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [array, setArray] = useState([]);
    const cookie = new Cookie();

    function LogOut() {
        const cookie = new Cookie();
        cookie.remove("LoggedIn", { path: '/' })
        cookie.remove("ID", { path: '/' })
        location.reload();
    }

    useEffect(() => {
        if (cookie.get('LoggedIn') === undefined) {
            Router.push('/login')
        }
        else {
            const username = 'admin'
            const password = 'admin123'
        
            const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')
        
            axios.get('http://localhost:3001/data', {
                params: { username: cookie.get('LoggedIn') },
                headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${token}`}
            }).then(response => {
                setData(response.data)
                setIsLoading(false)
            })

            axios.get('http://localhost:3001/data/questions', {
                params: {username: cookie.get('LoggedIn')}
            })
            .then(response => {
                setArray(response.data);
            })
        }


    }, [])

    if (isLoading) {
        return (
            <h3>Loading...</h3>
        )
    }

    return (
        <div>
            <Navbar />
            <div className={styles.inLineContainer1}>
                
                    <div className={styles.inLineContainer}>
                        <Image src="/user.svg" width="80" height="80"></Image>
                    </div>

                    <div className={styles.inLineContainer}>
                        <h1 className={styles.username} >{data.username}</h1>
                    </div>

                    <button className={styles.LogOutButton} onClick={LogOut} >Log Out</button>

                    <hr />

                    {array.map(question => {
                        return (
                            <div className={styles.Question} >
                                <a href={"/home/question/"+question.id} >{question.title}</a>
                                <p>{question.text}</p>
                            </div>
                        )
                    })}

            </div>
        </div>
    )
}