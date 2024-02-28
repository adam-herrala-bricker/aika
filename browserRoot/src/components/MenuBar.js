import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Menu, MenuItem} from 'semantic-ui-react';

const MenuBar = () => {
  const {pathname} = useLocation();
  const navigate = useNavigate();

  return (
    <div className = 'menu-bar-container'>
      <Menu
        borderless
        className = 'menu-settings'
        inverted>
        <MenuItem
          name = 'home'
          onClick = {() => navigate('/')}>
          <div className = {pathname === '/' ? 'menu-item-active' : 'menu-item-passive'}>
            Home
          </div>
        </MenuItem>
        <MenuItem
          name = 'about'
          onClick = {() => navigate('/about')}>
          <div className = {pathname.includes('about') ? 'menu-item-active' : 'menu-item-passive'}>
            About
          </div>
        </MenuItem>
        <MenuItem
          name = 'Aika'
          onClick = {() => navigate('/aika')}>
          <div className = {pathname.includes('aika') ? 'menu-item-active' : 'menu-item-passive'}>
            Aika
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default MenuBar;
