import React from 'react';
import '../../styles/auth/Login.css';

function Login() {
    return (
        <div className="login__page">
            <img className="login__logo" src="assets/Instagram-Logo.png" alt="Instagram logo"/>
            <form className="login__form" action="">
                <input className="login__formInput" type="text" placeholder="Phone number, username, or email"/>
                <input className="login__formInput pwdInput" type="text" placeholder="Password"/>
                <button type="submit">Log In</button>
                <hr className="line"/>
            </form>

            <div className="register__page">
                <p>Don't have an account? <a href='/register'>Sign up</a></p>
            </div>
        </div>
    )
}

export default Login
