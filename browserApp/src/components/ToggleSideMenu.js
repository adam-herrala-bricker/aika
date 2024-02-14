import React from 'react';
import {useDispatch} from 'react-redux';
import {useLocation} from 'react-router-dom';
import {toggleSideMenu} from '../reducers/viewReducer';
import {Button} from 'semantic-ui-react';

const ToggleSideMenu = ({thisUser}) => {
  const dispatch = useDispatch();
  // used to disable button when not in stream-slice view
  const location = useLocation();

  if (thisUser.username === 'guest') {
    return null;
  }

  return (
    <Button
      basic
      color = 'black'
      compact
      disabled = {location.pathname !== '/'}
      icon = 'content'
      onClick = {() => dispatch(toggleSideMenu())}
      size = 'huge'/>
  );
};

export default ToggleSideMenu;
