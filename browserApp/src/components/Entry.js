import React from 'react';
import {NavButton} from '.';

const Entry = () => {
  return (
    <div className = 'generic-flex-column'>
      <NavButton text = 'log in' path = '/login'/>
      <NavButton text = 'register' path = '/register'/>
    </div>
  );
};

export default Entry;
