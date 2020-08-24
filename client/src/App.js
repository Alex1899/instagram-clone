import React, { useEffect } from 'react';
import Post from './components/Post';
import Header from './components/Header';
import {BrowserRouter as Router, Switch, Route, useHistory} from 'react-router-dom'
import Login from './components/auth/Login';
import { useStateValue } from './context/StateProvider';
import Register from './components/auth/Register';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path='/'>
            <Header />
            <Post />
          </Route>
          <Route path='/login'>
            <Login />
          </Route>
          <Route path='/register'>
            <Register />
          </Route>
        </Switch>
      </div>
    </Router>
   

   
  );
}

export default App;
