import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useGetStreamsQuery} from '../services/streams';
import {clearStreamCache, setStream} from '../reducers/streamReducer';
import {closeSideMenu, resetView} from '../reducers/viewReducer';
import {Header, MenuItem} from 'semantic-ui-react';
import {CreateStream} from '.';

const Stream = ({thisStream}) => {
  const dispatch = useDispatch();
  const {userId} = useSelector((i) => i.user);
  const {loadedId} = useSelector((i) => i.stream);
  const isOwner = userId === thisStream.creatorId;

  // event handler
  // clears cache of loaded stream before loading new stream
  const handleClick = () => {
    if (thisStream.id !== loadedId) { // don't change state if you click on current stream
      // clears current cache if there's a loaded stream + resets scrolling
      dispatch(clearStreamCache(loadedId));

      // loads new stream
      dispatch(setStream({
        name: thisStream.name,
        id: thisStream.id
      }));

      // return to default view when switching between streams
      dispatch(resetView());
    }
    dispatch(closeSideMenu());
  };

  return (
    <MenuItem onClick = {handleClick}>
      <Header size = 'small'>
        {thisStream.name}
      </Header>
      {isOwner
        ? <div>owner</div>
        : <div>shared</div>}
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
    <div>
      <MenuItem>
        <Header size = 'medium'>My Streams</Header>
      </MenuItem>
      {data.map((streamUser) =>
        <Stream
          key = {streamUser.id}
          thisStream = {streamUser.stream} />
      )}
      <CreateStream />
    </div>
  );
};

export default Streams;
