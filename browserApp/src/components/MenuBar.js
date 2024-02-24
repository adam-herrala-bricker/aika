import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Header, Popup} from 'semantic-ui-react';
import {logOut} from '../reducers/userReducer';
import {ToggleSideMenu} from '.';
import {howLongUntil} from '../util/helpers';

const LogOutButton = ({thisUser}) => {
  const dispatch = useDispatch();
  const {minutesUntilTokenExpires} = useSelector((i) => i.user);
  const countdown = howLongUntil(minutesUntilTokenExpires);
  const warningThreshold = 5; // time in minutes
  const isWarning = minutesUntilTokenExpires < warningThreshold;
  const buttonText = isWarning ? `logout - ${countdown}`: 'logout';

  // event handler
  const handleLogout = () => {
    dispatch(logOut());
  };

  if (thisUser.username === 'guest') {
    return null;
  }

  return (
    <div>
      <Popup
        content = {`You will be automatically logged out in ${countdown}.`}
        disabled = {!isWarning}
        trigger = {
          <Button
            compact
            fluid
            negative = {isWarning}
            onClick = {handleLogout}>
            {buttonText}
          </Button>
        }/>

    </div>
  );
};

const UserDisplay = ({thisUser}) => {
  if (thisUser.username === 'guest') {
    return null;
  }

  return (
    <div className = 'username-container'>
      {thisUser.username}
    </div>
  );
};

const MenuBar = () => {
  const thisUser = useSelector((i) => i.user);

  return (
    <div className = 'menu-bar-container'>
      <ToggleSideMenu thisUser = {thisUser}/>
      <div className = 'menu-bar-text'>
        <Header size = 'huge'>
          Aika
        </Header>
      </div>
      <div className = 'menu-bar-user-group'>
        <UserDisplay thisUser = {thisUser}/>
        <LogOutButton thisUser = {thisUser}/>
      </div>
    </div>
  );
};

export default MenuBar;