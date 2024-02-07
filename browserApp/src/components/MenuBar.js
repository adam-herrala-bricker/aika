import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Header} from 'semantic-ui-react';
import {logOut} from '../reducers/userReducer';
import {ToggleSideMenu} from '.';

const LogOutButton = ({thisUser}) => {
  const dispatch = useDispatch();

  // event handler
  const handleLogout = () => {
    dispatch(logOut());
  };

  if (thisUser.username === 'guest') {
    return null;
  }

  return (
    <div>
      <Button onClick = {handleLogout}>
        log out
      </Button>
    </div>
  );
};

const UserDisplay = ({thisUser}) => {
  if (thisUser.username === 'guest') {
    return null;
  }

  return (
    <div>
      {thisUser.username}
    </div>
  );
};

const MenuBar = () => {
  const thisUser = useSelector((i) => i.user);

  return (
    <div className = 'menu-bar-container'>
      <div className = 'menu-bar-left'>
        <div>
          <Header size = 'huge'>
            Aika
          </Header>
        </div>
        <ToggleSideMenu thisUser = {thisUser}/>
        <LogOutButton thisUser = {thisUser}/>
      </div>
      <div>
        <UserDisplay thisUser = {thisUser}/>
      </div>
    </div>
  );
};

export default MenuBar;