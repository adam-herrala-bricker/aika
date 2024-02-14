import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useGetPermissionsQuery} from '../services/streams';
import {useGetSlicesQuery} from '../services/slices';
import {incrementScroller} from '../reducers/streamReducer';
import {Button, Header} from 'semantic-ui-react';
import {CreateSlice, SliceMenu} from '.';
import {customDateFormat, howLongAgo} from '../util/helpers';

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
    <div>
      <div className = 'slice-single-time-container'>
        <div>{howLongAgo(thisDate)}</div>
        <div className = 'slice-single-date-text'>
          {customDateFormat(thisDate)}
        </div>
      </div>
      <div className = 'slice-single-container'>
        <div className = 'slice-single-top-row'>
          <div className = 'slice-single-row'>
            <Header size = 'medium'>{slice.title}</Header>
            {slice.user.username}
          </div>
          <div>
            <Button
              basic
              color = 'red'
              compact
              size = 'mini'>
              delete
            </Button>
          </div>
        </div>
        <div className = 'slice-single-row'>
          {slice.isMilestone && <Tag color = 'darkblue' text = 'milestone'/>}
          {slice.isPublic && <Tag color = 'teal' text = 'public'/>}
        </div>
        {slice.text}
      </div>
    </div>
  );
};

const Slices = () => {
  const dispatch = useDispatch();
  const {loadedId, loadedName, scroller} = useSelector((i) => i.stream);
  const myPermissions = useGetPermissionsQuery(loadedId);
  // ref for element to add scroll event listener
  const scrollRef = React.useRef(0);

  const {data, isLoading, isError} = useGetSlicesQuery({
    streamId: loadedId,
    limit: scroller.limit,
    offset: scroller.offset
  });

  // used for infinite scrolling
  React.useLayoutEffect(() => { // critical that this is a layout effect!
    const onScroll = () => {
      const {clientHeight, scrollHeight, scrollTop} = scrollRef.current;

      const scrolledToBottom = scrollTop + clientHeight >= scrollHeight;
      if (scrolledToBottom && !isLoading) {
        dispatch(incrementScroller());
      }
    };

    scrollRef.current.addEventListener('scroll', onScroll);

    return () => {
      scrollRef.current.removeEventListener('scroll', onScroll);
    };
  }, [data, scrollRef]);

  // error
  if (isError) {
    console.log(data);
    return <div>error loading data</div>;
  }

  return (
    <div className = 'slice-view-container'>
      {loadedId && <SliceMenu stream = {{loadedName, loadedId}}/>}
      {myPermissions.write && <CreateSlice />}
      <div ref = {scrollRef} className = 'slice-scroll-region'>
        {data && data.map((slice) => <Slice key = {slice.id} slice = {slice}/>)}
      </div>
    </div>
  );
};

export default Slices;
