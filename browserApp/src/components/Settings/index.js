import React from 'react';
import {Header} from 'semantic-ui-react';
import {ExpandBox} from '..';
import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';
import DisplaySettings from './DisplaySettings';
import UserInfo from './UserInfo';

const Settings = () => {

  return(
    <div className = 'settings-container'>
      <div>
        <Header size = 'large'>Settings</Header>
      </div>
      <ExpandBox header = 'User info' child = {<UserInfo />}/>
      <ExpandBox header = 'Display settings' child = {<DisplaySettings />}/>
      <ExpandBox header = 'Change password' child = {<ChangePassword />}/>
      <ExpandBox header = 'Delete account' child = {<DeleteAccount />}/>
    </div>
  );
};

export default Settings;
