import React from 'react';
import text from '../assets/text';

const Home = () => {
  return (
    <div className = 'home-container'>
      <div className = 'title-container'>
        <div className = 'title-text'>
          Nasty
        </div>
        <div className = 'title-text'>
          Toboggan
        </div>
      </div>
      <div className = 'slogan-text'>
        {text.slogan}
      </div>
    </div>
  );
};

export default Home;
