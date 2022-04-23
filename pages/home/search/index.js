import styles from '../../../styles/Styles.module.css'
import React from 'react'
import Cookie from 'universal-cookie'
import { useEffect, useState, useRef } from 'react';
import axios from 'axios'
import Navbar from '../../layout/Navbar'
import Router from 'next/router'
import Question from './components/Question'

export default function Search() {
    
    const [data, setData] = useState([]);
    const search = useRef();
    
    const cookie = new Cookie();

    useEffect(() => {
        if (cookie.get('LoggedIn') === undefined) {
            Router.push('/login')
        }
    }, [])

    function handleSearch(e) {
        e.preventDefault()

        axios.get(`http://localhost:3001/search/${search.current.value}`)
        .then(response => {
            console.log(response.data)
            setData(response.data)
        })
    }

    return (
        <div>
            <Navbar />


            <h1>Search</h1>


            <form onSubmit={handleSearch}>
                <input ref={search} />
                <button>Search</button>
            </form>

            {data.map(question => {
                return(
                    <Question data={question} />
                )
            })}

        </div>
    )
}