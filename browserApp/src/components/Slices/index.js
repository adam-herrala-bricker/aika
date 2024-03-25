import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {incrementScroller} from '../../reducers/streamReducer';
import {useGetMyPermissionsQuery} from '../../services/streams';
import {useGetSlicesQuery} from '../../services/slices';
import Slice from './Slice';
import CreateSlice from './CreateSlice';
import SliceMenu from './SliceMenu';

const Slices = () => {
  const dispatch = useDispatch();
  const {loadedId, loadedName, scroller, search} = useSelector((i) => i.stream);
  const {imageRes} = useSelector((i) => i.view);
  // ref for element to add scroll event listener
  const scrollRef = React.useRef(0);

  const myPermissions = useGetMyPermissionsQuery(loadedId);
  const {data, isLoading, isError, isFetching} = useGetSlicesQuery({
    streamId: loadedId,
    limit: scroller.limit,
    offset: scroller.offset,
    search: search,
    res: imageRes
  });

  // used for infinite scrolling
  React.useLayoutEffect(() => { // critical that this is a layout effect!
    if (!isError && !isLoading && !myPermissions.isLoading) {
      const onScroll = () => {
        const {clientHeight, scrollHeight, scrollTop} = scrollRef.current;

        const scrolledToBottom =
          (scrollTop + clientHeight >= .95*scrollHeight);

        if (clientHeight > 0 && scrolledToBottom && !isFetching) {
          console.log('data length', data.length);
          dispatch(incrementScroller(data.length));
        }
      };

      scrollRef.current.addEventListener('scroll', onScroll);

      return () => {
        scrollRef.current.removeEventListener('scroll', onScroll);
      };
    }

  }, [data, scrollRef]);

  // error
  if (isError) {
    console.log(data);
    return <div>error loading data</div>;
  }

  if (isLoading || myPermissions.isLoading) {
    return <div>loading ...</div>;
  }

  return (
    <div className = 'slice-view-container'>
      {loadedId && <SliceMenu stream = {{loadedName, loadedId}}/>}
      {myPermissions?.data?.write && <CreateSlice />}
      {(search.length > 0 && !isFetching && !isLoading && data.length === 0) &&
        <div className = 'slice-no-search-results'>no slices found</div>}
      <div ref = {scrollRef} className = 'slice-scroll-region'>
        {data && data.map((slice) =>
          <Slice
            key = {slice.id}
            myPermissions = {myPermissions.data}
            slice = {slice}/>)}
      </div>
    </div>
  );
};

export default Slices;