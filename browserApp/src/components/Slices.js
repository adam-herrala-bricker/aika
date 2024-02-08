import React from 'react';
import {useSelector} from 'react-redux';
import {useGetSlicesQuery} from '../services/slices';
import {CreateSlice, SliceMenu} from '.';

const Slice = ({slice}) => {
  return (
    <div>
      {slice.title}
      {slice.text}
      {slice.isMilestone}
      {slice.isPublic}
      {slice.createdAt}
    </div>
  );
};

const Slices = () => {
  const {loadedId, loadedName} = useSelector((i) => i.stream);
  const {data, isLoading} = useGetSlicesQuery({streamId: loadedId});
  console.log(data);

  // don't display anything before slice is loaded
  if (!loadedId) {
    return null;
  }

  // loading data
  if (isLoading) {
    return <div>loading ...</div>;
  }

  return (
    <div className = 'slice-view-container'>
      <SliceMenu loadedName = {loadedName}/>
      {data.map((slice) => <Slice key = {slice.id} slice = {slice}/>)}
      <CreateSlice />
    </div>
  );
};

export default Slices;
