import { useEffect, useState } from 'react'
import Navbar from '../../layout/Navbar'
import Cookie from 'universal-cookie'
import axios from 'axios'
import { Router, useRouter } from "next/router"
import Question from '../search/components/Question'

export default function User() {
    const router = useRouter()
    const id = router.query.id

    const [data,setData] = useState();
    const [isLoading, setIsLoading] = useState(true)
    const [QuestionsArray, setQuestionsArray] = useState([])

    const cookie = new Cookie();

    useEffect(() => {
        if (cookie.get('LoggedIn') === undefined) {
            Router.push('/login')
        }
        else {
            const username = 'admin'
            const password = 'admin123'
        
            const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')
        
            axios.get(`http://localhost:3001/user`, {
                params: {id:id},
                headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${token}`}
            }).then(response => {
                setData(response.data)
            

            axios.get(`http://localhost:3001/data/questions`, {
                params: {username:response.data.username},
                headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${token}`}
            }).then(response => {
                setQuestionsArray(response.data)
                setIsLoading(false)
            })
            })

        }
    }, [id])

    if (isLoading) {
        return (
            <h1>Loading...</h1>
        )
    }

    return (
        <div>
            <Navbar />

            <h1>{data.username}</h1>

            <hr />

            <h3>Questions ({QuestionsArray.length}):</h3>

            {QuestionsArray.map(question => {
                return (
                    <Question data={question} />
                )
            })}
        </div>
    )
}