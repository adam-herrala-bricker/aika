import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import About from './components/About';
import Aika from './components/Aika';
import Home from './components/Home';
import MenuBar from './components/MenuBar';

const App = () => {
  return (
    <div className = 'app-container'>
      <MenuBar />
      <Routes>
        <Route path = '/' element = {<Home />}/>
        <Route path = 'about' element = {<About />}/>
        <Route path = 'aika' element = {<Aika />}/>
        <Route path = '*' element = {<Navigate to = '/' replace />}/>
      </Routes>
    </div>
  );
};

export default App;
