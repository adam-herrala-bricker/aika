import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useGetStreamsQuery} from '../services/streams';
import {setStream} from '../reducers/streamReducer';
import {closeSideMenu} from '../reducers/viewReducer';
import {Header, MenuItem} from 'semantic-ui-react';
import {CreateStream} from '.';

const Stream = ({thisStream}) => {
  const dispatch = useDispatch();
  const {userId} = useSelector((i) => i.user);
  const isOwner = userId === thisStream.creatorId;

  // event handler
  const handleClick = () => {
    dispatch(setStream({
      name: thisStream.name,
      id: thisStream.id
    }));
    dispatch(closeSideMenu());
  };

  return (
    <MenuItem onClick = {handleClick}>
      <Header size = 'small'>
        {thisStream.name}
      </Header>
      {isOwner && <div>owner</div>}
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
