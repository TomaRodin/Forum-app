import { Router, useRouter } from "next/router"
import { useEffect, useState } from "react"
import Navbar from '../../layout/Navbar'
import Cookie from 'universal-cookie'
import axios from 'axios'

export default function Question() {
    const [data,setData] = useState();
    const [isLoading, setIsLoading] = useState(true)

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
        }
    }, [id])

    if (isLoading) {
        return <h1>Loading...</h1>
    }

    return(
        <div>
            <Navbar />
            
            <h1>{data.title}</h1>

            <p>{data.text}</p>
        </div>
    )
}