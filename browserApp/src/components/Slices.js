import React from 'react';
import {useSelector} from 'react-redux';
import {useGetSlicesQuery} from '../services/slices';
import {Header} from 'semantic-ui-react';
import {CreateSlice, SliceMenu} from '.';

const Tag = ({text, color = 'black'}) => {
  return (
    <div
      className = 'tag-container'
      style = {{color: color}}>
      {text}
    </div>
  );
};

const Slice = ({slice}) => {
  const thisDate = new Date(slice.createdAt);

  return (
    <div className = 'slice-single-container'>
      <div className = 'slice-single-header'>
        <Header size = 'medium'>{slice.title}</Header>
        {thisDate.toLocaleTimeString('fi-FI')} |
        {thisDate.toLocaleDateString('fi-FI')}
      </div>
      {slice.isMilestone && <Tag color = 'darkblue' text = 'milestone'/>}
      {slice.isPublic && <Tag color = 'teal' text = 'public'/>}
      {slice.text}
    </div>
  );
};

const Slices = () => {
  const {loadedId, loadedName} = useSelector((i) => i.stream);
  const {data, isLoading} = useGetSlicesQuery({streamId: loadedId});

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
      <CreateSlice />
      {data.map((slice) => <Slice key = {slice.id} slice = {slice}/>)}
    </div>
  );
};

export default Slices;
