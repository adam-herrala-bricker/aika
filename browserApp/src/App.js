import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {logOut, setUser, updateTokenExpiry} from './reducers/userReducer';
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
  const [timerTicks, setTimerTicks] = React.useState(0);
  const timeoutRate = thisUser.minutesUntilTokenExpires > 3 ? 60*1000 : 1000;

  React.useEffect(() => {
    if (thisUser !== 'guest') {
      dispatch(updateTokenExpiry());

      if (thisUser.minutesUntilTokenExpires <= .05) { // just before 0
        dispatch(logOut());
      }

      const thisTimeout = setTimeout(() => {
        setTimerTicks(timerTicks + 1);
      }, timeoutRate); // every minute/second

      return () => {clearTimeout(thisTimeout);};
    }

  }, [thisUser.token, timerTicks]);

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
