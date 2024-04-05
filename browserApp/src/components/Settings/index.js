import React from 'react';
import {useSelector} from 'react-redux';
import {Header} from 'semantic-ui-react';
import {ExpandBox} from '..';
import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';
import DisplaySettings from './DisplaySettings';
import UserInfo from './UserInfo';

const Settings = () => {
  const {appWidth, mobileBreakpoint} = useSelector((i) => i.view);

  return(
    <div className = {appWidth > mobileBreakpoint ? 'settings-container-browser' : 'settings-container-mobile'}>
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
