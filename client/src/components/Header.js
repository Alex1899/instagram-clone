import React, { useEffect } from 'react';
import {useHistory} from 'react-router-dom'
import { useStateValue } from '../context/StateProvider';
import '../styles/Header.css';
function Header() {
    const { state, dispatch } = useStateValue();
    const history = useHistory();
  
    useEffect(()=> {
      if (!state.user){
        history.push('/login');
      }
    }, [state])
    return (
        <div className='header'>
            <img className='header__image' src='assets/Instagram-Logo.png' />
        </div>
    )
}

export default Header
