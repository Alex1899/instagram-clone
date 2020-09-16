import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../../styles/auth/Register.css';
import axios from 'axios';
import { useStateValue } from '../../context/StateProvider';


function Register() {
    const initialFormData = {
        email: '',
        fullname: '',
        username: '',
        password: '',
        passwordCheck: ''
    }

    const [ formData, setFormData ] = useState(initialFormData);
    const history = useHistory();
    const { state, dispatch } = useStateValue();


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value.trim()
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/users/register', formData)
            .then(response => {
                dispatch({ type: "LOGIN_USER", payload: response.data});
                history.push('/');
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="register">
            <img className="register__logo" src="assets/Instagram-Logo.png" alt="Instagram logo"/>
            <form className="register__form" action="">
                <p className="register__welcomeText">Sign up to see photos and videos from your friends</p>
                <input className="register__formInput" onChange={handleChange} name="email"  type="text" placeholder="Mobile Number or Email"/>
                <input className="register__formInput" onChange={handleChange} name="fullname" type="text" placeholder="Full Name"/>
                <input className="register__formInput" onChange={handleChange} name="username" type="text" placeholder="Username"/>
                <input className="register__formInput" onChange={handleChange} name="password" type="password" placeholder="Password"/>
                <input className="register__formInput pwdInput" onChange={handleChange} name="passwordCheck" type="password" placeholder="Retype Password"/>
                <button type="submit" onClick={handleSubmit}>Sign Up</button>
                <p className="register__formBottomText">By signin up, you agree to our Terms, Data Policy and Cookies Policy.</p>
                <hr className="line"/>
            </form>

            <div className="login">
                <p>Already have an account? <a href='/login'>Sign in</a></p>
            </div>
        </div>
    )
}

export default Register
