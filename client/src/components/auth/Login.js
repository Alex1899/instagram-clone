import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../../styles/auth/Login.css';
import axios from 'axios';
import { useStateValue } from '../../context/StateProvider';

function Login() {
    const initialFormData = {
        username: '',
        password: ''
    }

    const [ formData, setFormData ] = useState(initialFormData);
    const history = useHistory();
    const { state, dispatch } = useStateValue();

    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:9000/users/login', formData)
        .then(response => {
            console.log(response.data);
            dispatch({ type: "LOGIN_USER", payload: response.data});
            history.push('/');
        })
        .catch(err => console.log(err));
    }

    return (
        <div className="login__page">
            <img className="login__logo" src="assets/Instagram-Logo.png" alt="Instagram logo"/>
            <form className="login__form" action="">
                <input className="login__formInput" onChange={handleChange} name="username" type="text" placeholder="Phone number, username, or email"/>
                <input className="login__formInput pwdInput" onChange={handleChange} name="password" type="password" placeholder="Password"/>
                <button onClick={handleSubmit} type="submit">Log In</button>
                <hr className="line"/>
            </form>

            <div className="register__page">
                <p>Don't have an account? <a href='/register'>Sign up</a></p>
            </div>
        </div>
    )
}

export default Login
