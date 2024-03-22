import React from 'react';
import {useDispatch} from 'react-redux';
import {setStreamSliceMain} from '../reducers/viewReducer';
import {Header, MenuItem} from 'semantic-ui-react';

const SettingsButton = () => {
  const dispatch = useDispatch();

  return(
    <MenuItem onClick = {() => dispatch(setStreamSliceMain('settings'))}>
      <Header size = 'medium'>Settings</Header>
    </MenuItem>
  );
};

export default SettingsButton;
