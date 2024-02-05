import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {Header} from 'semantic-ui-react';

const Home = () => {
  return (
    <div>
      home
    </div>
  );
};

const App = () => {
  console.log(BACKEND_URL); // eslint-disable-line no-undef
  return (
    <div>
      <Header as = 'h1'>
        It works!
      </Header>
      <Routes>
        <Route path = '/' element = {<Home />}/>
      </Routes>
    </div>
  );
};

export default App;
