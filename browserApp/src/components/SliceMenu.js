import React from 'react';
import {useDebouncedCallback} from 'use-debounce';
import {useDispatch} from 'react-redux';
import {clearStreamCache, setSearch} from '../reducers/streamReducer';
import {setStreamSliceMain} from '../reducers/viewReducer';
import {Button, Header, Input} from 'semantic-ui-react';

const SliceMenu = ({stream}) => {
  const dispatch = useDispatch();

  const debouncedSearch = useDebouncedCallback((value) => {
    dispatch(clearStreamCache(stream.loadedId));
    dispatch(setSearch(value));
  }, 300);

  const handleStreamSelect = () => {
    dispatch(clearStreamCache(stream.loadedId)); // clear cache when navigating away
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
        onChange = {(e) => debouncedSearch(e.target.value)}
        placeholder = 'search stream . . .'/>
    </div>
  );
};

export default SliceMenu;
