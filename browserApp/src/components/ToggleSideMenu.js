import React from 'react';
import {useDispatch} from 'react-redux';
import {toggleSideMenu} from '../reducers/viewReducer';
import {Button} from 'semantic-ui-react';

const ToggleSideMenu = ({thisUser}) => {
  const dispatch = useDispatch();

  if (thisUser.username === 'guest') {
    return null;
  }

  return (
    <div className = 'toggle-side-button-container'>
      <Button
        basic
        color = 'black'
        compact
        icon = 'content'
        onClick = {() => dispatch(toggleSideMenu())}
        size = 'huge'/>
    </div>
  );
};

export default ToggleSideMenu;
