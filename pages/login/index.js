import React from 'react'
import { useRef, useState, useEffect } from 'react'
import axios from 'axios'
import Cookie from 'universal-cookie'
import styles from '../../styles/Styles.module.css'
import Router from 'next/router'


export default function index() {

    const [isFalse, setIsFalse] = useState()

    const username = useRef()
    const password = useRef()

    const cookie = new Cookie();

    const handleSubmit = (e) => {
        e.preventDefault();

        const authUsername = 'admin'
        const authPassword = 'admin123'

        const token = Buffer.from(`${authUsername}:${authPassword}`, 'utf8').toString('base64')

        axios.get('http://localhost:3001/login', {
            params: { username: username.current.value, password: password.current.value },
            headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${token}` },
        }).then(response => {
            console.log(response.data.status)
            if (response.data.status === true) {
                cookie.set('LoggedIn', response.data.username, { path: "/" })
                cookie.set('ID', response.data.id, { path: "/" })
                Router.push('/home')
            }
            else if (response.data.status === false) {
                setIsFalse("Wrong username or password")
            }
        })
    }


    useEffect(() => {
        if (cookie.get('LoggedIn') !== undefined) {
            Router.push('/home')
        }
    }, [])

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.form} >
                    <form onSubmit={handleSubmit}>
                        <h1>Login</h1>
                        <input type="text" placeholder="Username:" ref={username} ></input>
                        <br />
                        <input type="password" placeholder="Password:" ref={password} ></input>
                        <br />
                        {isFalse}
                        <br />
                        <button>Log In</button>
                        <br />
                        <a href="/register">Register</a>
                    </form>
                </div>
            </div>
        </div>
    )
}
