import React, { useEffect } from 'react';
import Home from './components/Home';
import Header from './components/Header';
import Profile from './components/Profile';
import {BrowserRouter as Router, Switch, Route, useHistory} from 'react-router-dom'
import Login from './components/auth/Login';
import { useStateValue } from './context/StateProvider';
import Register from './components/auth/Register';
import EditProfile from './components/settings/EditProfile';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path='/'>
            <Header />
            <Home />
          </Route>
          <Route path='/login'>
            <Login />
          </Route>
          <Route path='/register'>
            <Register />
          </Route>
          <Route path='/profile'>
            <Header />
            <Profile />
          </Route>
          <Route path='/account/edit'>
            <Header />
            <EditProfile />
          </Route>
        </Switch>
      </div>
    </Router>
   

   
  );
}

export default App;
