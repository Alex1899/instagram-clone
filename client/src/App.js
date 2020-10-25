import React, { useEffect } from 'react';
import Home from './components/Home';
import Header from './components/Header';
import Profile from './components/Profile';
import {BrowserRouter as Router, Switch, Route, useHistory} from 'react-router-dom'
import Login from './components/auth/Login';
import { useStateValue } from './context/StateProvider';
import Register from './components/auth/Register';
import Settings from './components/settings/Settings';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path='/'>
            <Header />
            <Home />
            <Footer />
          </Route>
          <Route path='/login'>
            <Login />
            <Footer />
          </Route>
          <Route path='/register'>
            <Register />
            <Footer />
          </Route>
          <Route path='/profile'>
            <Header />
            <Profile />
            <Footer />
          </Route>
          <Route path='/account-edit'>
            <Header />
            <Settings />
            <Footer />
          </Route>
        </Switch>
      </div>
    </Router>
   

   
  );
}

export default App;
