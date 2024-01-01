import { Component, useState } from "react";
import { NavData } from "./NavData";
import { useCookies } from 'react-cookie'

const Navbar = () => {
    const [ state, setState ] = useState({clicked: false})
    const [ cookies, setCookie, removeCookie ] = useCookies(null)

    const handleClick = (e) => {
        console.log(e)
        if (e.title == 'Sign Out') {
            // handle sign out
            console.log('sign out')
            // need to remove cookies
            removeCookie('Email')
            removeCookie('AuthToken')
            window.location.reload()
        } else {
            setState({clicked: !state.clicked})
        }
    }

    return (
        <nav className="NavbarItems">
            <h1 className="logo">
                Breach <i class="fab fa-wolf-pack-battalion"></i>
            </h1>

            <div className="menu-icons"
                onClick={handleClick}
            >
                <i className=
                {state.clicked ? 
                "fas fa-times" : "fas fa-bars"}
                >
                </i>
            </div>

            <ul className={state.clicked ? "nav-menu active" : "nav-menu"}>
                {NavData.map((item, index) => {
                    return (
                        <li 
                        key={index}
                        onClick={() => handleClick(item)}>
                            <a href={item.url} className={item.cName}>
                                <i className={item.icon}></i>{item.title}
                            </a>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}

export default Navbar