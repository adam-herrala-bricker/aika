import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from './reducers/userReducer';
import {Entry, LogIn, MenuBar, Register, Welcome} from './components';

const Home = ({thisUser}) => {
  return (
    thisUser.username === 'guest'
      ? <Entry />
      : <Welcome />
  );
};

const App = () => {
  const dispatch = useDispatch();
  const thisUser = useSelector((i) => i.user);

  // keep user logged in on refresh
  const loggedInUserJSON = window.localStorage.getItem('aikaUser');
  const loggedInUser = JSON.parse(loggedInUserJSON);
  if (loggedInUser && thisUser.username === 'guest') {
    dispatch(setUser(loggedInUser));
  }

  return (
    <div className = 'outer-container'>
      <div className = 'app-container'>
        <MenuBar />
        <div className = {thisUser.username === 'guest'
          ? 'body-container-centered'
          : 'body-container-left'}>
          <Routes>
            <Route path = '/' element = {<Home thisUser = {thisUser}/>}/>
            <Route path = '/login' element = {<LogIn />}/>
            <Route path = '/register' element = {<Register />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
