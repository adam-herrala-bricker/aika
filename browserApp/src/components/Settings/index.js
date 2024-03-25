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
      <ExpandBox header = 'User info'><UserInfo /></ExpandBox>
      <ExpandBox header = 'Display settings'><DisplaySettings /></ExpandBox>
      <ExpandBox header = 'Change password'><ChangePassword /></ExpandBox>
      <ExpandBox header = 'Delete account'><DeleteAccount /></ExpandBox>
    </div>
  );
};

export default Settings;
