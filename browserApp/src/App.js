import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from './reducers/userReducer';
import {Entry, LogIn, MenuBar, Register, Welcome} from './components';

const Home = () => {
  const dispatch = useDispatch();
  const thisUser = useSelector((i) => i.user);

  // keep user logged in on refresh
  const loggedInUserJSON = window.localStorage.getItem('aikaUser');
  const loggedInUser = JSON.parse(loggedInUserJSON);
  if (loggedInUser && thisUser.username === 'guest') {
    dispatch(setUser(loggedInUser));
  }

  return (
    <div>
      {thisUser.username === 'guest'
        ? <Entry />
        : <Welcome />
      }
    </div>
  );
};

const App = () => {
  return (
    <div className = 'outer-container'>
      <div className = 'app-container'>
        <MenuBar />
        <div className = 'body-container'>
          <Routes>
            <Route path = '/' element = {<Home />}/>
            <Route path = '/login' element = {<LogIn />}/>
            <Route path = '/register' element = {<Register />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
