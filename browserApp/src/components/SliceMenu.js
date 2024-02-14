import React from 'react';
import {useDispatch} from 'react-redux';
import {clearStreamCache} from '../reducers/streamReducer';
import {resetScrollView, setStreamSliceMain} from '../reducers/viewReducer';
import {Button, Header, Input} from 'semantic-ui-react';

const SliceMenu = ({stream}) => {
  const dispatch = useDispatch();

  // event handler
  const handleStreamSelect = () => {
    dispatch(clearStreamCache(stream.loadedId)); // clear cache when navigating away
    dispatch(resetScrollView()); // also reset scrolling
    dispatch(setStreamSliceMain('info'));
  };

  return (
    <div className = 'menu-slice-container'>
      <Button
        color = 'black'
        compact
        onClick = {handleStreamSelect}>
        <Header inverted>
          {stream.loadedName}
        </Header>
      </Button>
      <Input
        className = 'stretchy'
        icon = 'search'
        placeholder = 'search stream . . .'/>
    </div>
  );
};

export default SliceMenu;
