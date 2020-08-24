import React from 'react';
import '../../styles/auth/Register.css';


function Register() {
    return (
        <div className="register">
            <img className="register__logo" src="assets/Instagram-Logo.png" alt="Instagram logo"/>
            <form className="register__form" action="">
                <input className="register__formInput" type="text" placeholder="Mobile Number or Email"/>
                <input className="register__formInput" type="text" placeholder="Full Name"/>
                <input className="register__formInput" type="text" placeholder="Username"/>
                <input className="register__formInput pwdInput" type="text" placeholder="Password"/>
                <button type="submit">Sign Up</button>
                <p>By signin up, you agree to our Terms, Data Policy and Cookies Policy.</p>
                <hr className="line"/>
            </form>

            <div className="login">
                <p>Already have an account? <a href='/login'>Sign in</a></p>
            </div>
        </div>
    )
}

export default Register
