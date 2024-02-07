import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {Entry, LogIn, MenuBar, Register, Welcome} from './components';

const Home = () => {
  const thisUser = useSelector((i) => i.user);

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
