import React from 'react';
import {useSelector} from 'react-redux';
import {useGetStreamsQuery} from '../services/streams';
import {Header, MenuItem} from 'semantic-ui-react';
import {CreateStream} from '.';

const Stream = ({thisStream}) => {
  const {userId} = useSelector((i) => i.user);
  const isOwner = userId === thisStream.creatorId;

  // event handler
  const handleClick = () => {
    console.log('clicked!');
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
