import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import About from './components/About';
import Aika from './components/Aika';
import Home from './components/Home';
import MenuBar from './components/MenuBar';

const App = () => {
  return (
    <div className = 'app-container'>
      <div className = 'app-space-between'>
        <div>
          <MenuBar />
          <Routes>
            <Route path = '/' element = {<Home />}/>
            <Route path = 'about' element = {<About />}/>
            <Route path = 'aika' element = {<Aika />}/>
            <Route path = '*' element = {<Navigate to = '/' replace />}/>
          </Routes>
        </div>
        <footer className = 'footer-container'>
          info@nastytoboggan.com
        </footer>
      </div>
    </div>
  );
};

export default App;
