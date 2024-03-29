import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useGetStreamsQuery} from '../services/streams';
import {clearStreamCache, setStream} from '../reducers/streamReducer';
import {closeSideMenu, resetView} from '../reducers/viewReducer';
import {Header, Icon, MenuItem} from 'semantic-ui-react';
import {CreateStream, SettingsButton} from '.';

const Stream = ({thisStream}) => {
  const dispatch = useDispatch();
  const {userId} = useSelector((i) => i.user);
  const {loadedId, scroller} = useSelector((i) => i.stream);
  const {streamSliceMain} = useSelector((i) => i.view);
  const isOwner = userId === thisStream.creatorId;

  const selectedStream = thisStream.id === loadedId;
  const sliceView = streamSliceMain === 'slice';

  // event handler
  // clears cache of loaded stream before loading new stream
  const handleClick = () => {
    // clears current cache if there's a loaded stream + resets scrolling
    dispatch(clearStreamCache(loadedId));

    // loads new stream
    dispatch(setStream({
      name: thisStream.name,
      id: thisStream.id
    }));

    // return to default view when switching between streams
    dispatch(resetView());
    dispatch(closeSideMenu());
  };

  return (
    <MenuItem
      disabled = {sliceView && selectedStream && scroller.offset === 0}
      onClick = {handleClick}>
      {sliceView && selectedStream &&
        <div className = 'refresh-stream'>
          <Icon name = 'refresh' />
        </div>}
      <div className = {sliceView && selectedStream ? 'stream-selected' : 'stream-not-selected'}>
        <Header
          className = 'header-truncate'
          size = 'small'>
          {thisStream.name}
        </Header>
        <div className = 'text-opaque'>
          {isOwner
            ? <div>owner</div>
            : <div>shared</div>}
        </div>
      </div>
    </MenuItem>
  );
};

const Streams = () => {
  // remember that this returns a StreamUser instance
  const {data, isLoading} = useGetStreamsQuery();

  if (isLoading) {
    return (
      <div>
        loading ...
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        something went wrong
      </div>
    );
  }

  return (
    <div className = 'streams-container'>
      <MenuItem>
        <Header size = 'medium'>My Streams</Header>
      </MenuItem>
      {data.map((streamUser) =>
        <Stream
          key = {streamUser.id}
          thisStream = {streamUser.stream} />
      )}
      <CreateStream />
      <SettingsButton />
    </div>
  );
};

export default Streams;
