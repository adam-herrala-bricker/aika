import React from 'react';
import {NavButton} from '.';

const Entry = () => {
  return (
    <div className = 'generic-flex-column'>
      <NavButton
        color = 'vk'
        text = 'log in'
        path = '/login'/>
      <NavButton
        basic
        color = 'black'
        text = 'register'
        path = '/register'/>
    </div>
  );
};

export default Entry;
