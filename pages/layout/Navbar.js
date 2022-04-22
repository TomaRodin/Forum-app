import styles from '../../styles/Styles.module.css'
import Link from 'next/link'
import Cookie from 'universal-cookie'

export default function Navbar() {

    const cookie = new Cookie();

    return (
        <ul>
            <Link href="/home"><li><a>Home</a></li></Link>
            <Link href="/home/search"><li><a>Search</a></li></Link>
            <Link href="/home/add"><li><a>Add</a></li></Link>
            <li className={styles.profile} ><a href="/home/profile">{cookie.get('LoggedIn')}</a></li>
        </ul>
    )
}