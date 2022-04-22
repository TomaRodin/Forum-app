import React from 'react'
import Cookie from 'universal-cookie'
import { useEffect, useState, useRef } from 'react';
import axios from 'axios'
import styles from '../../styles/Styles.module.css'
import Navbar from '../layout/Navbar'
import Router from 'next/router'


export default function index() {

    const cookie = new Cookie();

    useEffect(() => {
        if (cookie.get('LoggedIn') === undefined) {
            Router.push('/login')
        }
    }, [])

    return (
        <div>
            <Navbar />
        </div>
    )
}
