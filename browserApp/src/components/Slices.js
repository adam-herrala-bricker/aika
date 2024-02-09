import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useGetSlicesQuery} from '../services/slices';
import {incrementScroller} from '../reducers/streamReducer';
import {setCachedDataLength, setShowLoadMore} from '../reducers/viewReducer';
import {Button, Header} from 'semantic-ui-react';
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
      <div className = 'slice-single-row'>
        <Header size = 'medium'>{slice.title}</Header>
        {thisDate.toLocaleTimeString('fi-FI')} | {thisDate.toLocaleDateString('fi-FI')}
      </div>
      <div className = 'slice-single-row'>
        {slice.isMilestone && <Tag color = 'darkblue' text = 'milestone'/>}
        {slice.isPublic && <Tag color = 'teal' text = 'public'/>}
      </div>
      {slice.text}
    </div>
  );
};

const Slices = () => {
  const dispatch = useDispatch();
  const {loadedId, loadedName, scroller} = useSelector((i) => i.stream);
  const {cachedDataLength, showLoadMore} = useSelector((i) => i.view);

  const {data, isLoading, isError} = useGetSlicesQuery({
    streamId: loadedId,
    limit: scroller.limit,
    offset: scroller.offset
  });

  // event handler
  const handleShowMore = () => {
    // changes scroll values to load more
    dispatch(incrementScroller());
    // checks if we've reached the bottom
    if (data.length === cachedDataLength) {
      dispatch(setShowLoadMore(false));
    }

    dispatch(setCachedDataLength(data.length));
  };

  // don't display anything before slice is loaded
  if (!loadedId) {
    return null;
  }

  // loading data
  if (isLoading) {
    return <div>loading ...</div>;
  }

  // error
  if (isError) {
    console.log(data);
    return <div>error loading data</div>;
  }

  return (
    <div className = 'slice-view-container'>
      <SliceMenu loadedName = {loadedName}/>
      <CreateSlice />
      <div className = 'slice-scroll-region'>
        {data.map((slice) => <Slice key = {slice.id} slice = {slice}/>)}
        <div>
          {showLoadMore &&
          <Button
            onClick = {handleShowMore}
            fluid
            primary>
            Load more
          </Button>}
        </div>
      </div>
    </div>
  );
};

export default Slices;
