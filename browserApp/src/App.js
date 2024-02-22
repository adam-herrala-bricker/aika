import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {manageAutoLogout, setUser} from './reducers/userReducer';
import {Entry, LogIn, MenuBar, Register, StreamSliceView} from './components';

const Home = ({thisUser}) => {
  return (
    thisUser.username === 'guest'
      ? <Entry />
      : <StreamSliceView />
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

  // simple timer to keep track of token expiry
  React.useEffect(() => {
    if (thisUser !== 'guest') {
      const thisTimeout = dispatch(manageAutoLogout(thisUser.minutesUntilTokenExpires));
      return () => {clearTimeout(thisTimeout);};
    }
  }, [thisUser]);

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
