import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {Header} from 'semantic-ui-react';
import {Entry, LogIn, NavButton, Register, Welcome} from './components';

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
        <Header size = 'huge'>
          Aika
        </Header>
        <Routes>
          <Route path = '/' element = {<Home />}/>
          <Route path = '/login' element = {<LogIn />}/>
          <Route path = '/register' element = {<Register />} />
        </Routes>
        <div className = 'generic-flex-column'>
          <NavButton text = 'back' path = '/'/>
        </div>
      </div>
    </div>
  );
};

export default App;
