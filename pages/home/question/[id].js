import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import Navbar from '../../layout/Navbar'
import Cookie from 'universal-cookie'
import axios from 'axios'
import styles from '../../../styles/Styles.module.css'
import Image from 'next/image'
import Comment from './components/Comment'
import Router from 'next/router'

export default function Question() {
    const [data,setData] = useState();
    const [isLoading, setIsLoading] = useState(true)
    const [answers, setAnswers] = useState([]);
    const answer = useRef();

    const router = useRouter()
    const id = router.query.id

    const cookie = new Cookie();

    useEffect(() => {
        if (cookie.get('LoggedIn') === undefined) {
            Router.push('/login')
        }
        else {
            const username = 'admin'
            const password = 'admin123'
        
            const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')
        
            axios.get(`http://localhost:3001/question`, {
                params: {id:id},
                headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${token}`}
            }).then(response => {
                setData(response.data)
                setIsLoading(false)
            })

            axios.get(`http://localhost:3001/answers`, {
                params: {id:id},
                headers: { 'Content-Type': 'application/json'}
            }).then(response => {
                setAnswers(response.data.reverse())
            })
        }
    }, [id])

    function handleDelete() {
        const username = 'admin'
        const password = 'admin123'
    
        const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')

        const options = {
            data: {id:id},
            headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${token}`}
        }

        axios.delete(`http://localhost:3001/question`, options)
        .then(response => {
            if (response.data.success === true) {
                Router.push('/home/profile')
            }
        })
    }

    function ShowDeleteButton() {
        if (Number(cookie.get('ID')) === data.userID && cookie.get('LoggedIn') === data.username) {
            return (
                <div>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            )
        }
        else {
            return (
                <div></div>
            )
        }
    }

    function handlePost(e) {
        e.preventDefault();

        class Data {
            constructor(name, answer,id,userID) {
                this.name = name
                this.answer = answer
                this.id = id
                this.userID = userID
            }
        }

        const data = new Data(cookie.get('LoggedIn'), answer.current.value, id, cookie.get('ID'))

        const authUsername = 'admin'
        const authPassword = 'admin123'
    
        const token = Buffer.from(`${authUsername}:${authPassword}`, 'utf8').toString('base64')

        fetch('http://localhost:3001/answer', {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${token}` },
            body: JSON.stringify(data),
            method: 'POST'
        })

        location.reload();
    }

    if (isLoading) {
        return <h1>Loading...</h1>
    }

    return(
        <div>
            <Navbar />
            
            <div className={styles.QuestionContainer}>
                <h1>{data.title}</h1>
                <p>{data.text}</p>
                <p className={styles.Author} >By: {data.username}</p>
                <ShowDeleteButton />
            </div>

            <br />
            <hr />

            <div className={styles.AnswerContainer}>
                <h3>Answers ({answers.length}): </h3>
                
                <form onSubmit={handlePost}>
                    <Image src="/user.svg" width="80" height="80"></Image>
                    <textarea className={styles.textareaA} ref={answer} required />
                    <button>Post</button>
                </form>

                {answers.map(answer => {
                    return (
                        <Comment data={answer} />
                    )
                })}

            </div>
        </div>
    )
}