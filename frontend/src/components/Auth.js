import { useState } from 'react'
import { useCookies } from 'react-cookie'
import {  LockOutlined, UserOutlined  } from '@ant-design/icons'

const Auth = () => {
    const [ cookies, setCookie, removeCookie ] = useCookies(null)
    const [ isLogin, setIsLogin ] = useState(true)
    const [ error, setError ] = useState(null)
    const [ email, setEmail ] = useState(null)
    const [ password, setPassword ] = useState(null)
    const [ confirmPassword, setConfirmPassword ] = useState(null)

    console.log(cookies)
    
    const viewLogin = (status) => {
        setError(null)
        setIsLogin(status)
    }

    const handleSubmit = async (e, endpoint) => {
        console.log("subbing")

        // dont want form reloading
        e.preventDefault()
        if (!isLogin && password != confirmPassword) {
            setError('Make sure passwords match!')
            return
        }

        const resp = await fetch(`${process.env.REACT_APP_SERVERURL}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify({ email, password })
        })

        // await cuz .json is an async method
        const data  = await resp.json()
        
        if (data.detail) {
            setError(data.detail)
        } else {
            setCookie('Email', data.email)
            setCookie('AuthToken', data.token)

            window.location.reload()
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-container-box">
                <form>
                    <h2>{isLogin ? 'Please log in' : 'Please sign up!'}</h2>
                    <input 
                        type="email" 
                        placeholder="email" 
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {!isLogin && <input 
                        type="password" 
                        placeholder="confirm password" 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />}
                    <input type="submit" className="create" onClick={(e) => handleSubmit(e, isLogin ? 'login' : 'signup')}/>
                    {/* if error exists, show error */}
                    {error && <p style={{'color': 'red'}}>{error}</p>}
                </form>
                <br/>
                <div className='auth-options'>
                    <button 
                        onClick={() => viewLogin(false)}
                        style={{backgroundColor : isLogin ? 'rgb(215, 255, 255)' : 'rgb(53, 155, 155)'}}
                    >Sign Up</button>
                    <button 
                        onClick={() => viewLogin(true)}
                        style={{backgroundColor : !isLogin ? 'rgb(215, 255, 255)' : 'rgb(53, 155, 155)'}}
                    >Login</button>
                </div>
            </div>
        </div>
    )
}

export default Auth
  