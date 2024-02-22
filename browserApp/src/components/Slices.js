import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {appApi} from '../services/config';
import {useGetMyPermissionsQuery} from '../services/streams';
import {useDeleteSliceMutation, useGetSlicesQuery} from '../services/slices';
import {incrementScroller, resetScroller} from '../reducers/streamReducer';
import {Button, Confirm, Header, Image, Transition} from 'semantic-ui-react';
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

const TagGroup = ({slice}) => {

  return (
    <div className = 'slice-single-row'>
      {slice.isMilestone && <Tag color = 'darkblue' text = 'milestone'/>}
      {slice.isPublic && <Tag color = 'teal' text = 'public'/>}
    </div>
  );
};

const SliceImage = ({slice}) => {
  // max and min height the image can take
  const maxHeight = 70;
  const minHeight = 10;
  const heightIncrement = 10; // amount it changes by +/-
  const [imageHeight, setImageHeight] = React.useState(30);
  const [imageSrc, setImageSrc] = React.useState(null);
  const [visible, setVisible] = React.useState(true); // used to cross fade images
  const [changeDirection, setChangeDirection] = React.useState(null); // can be + or -
  const {token} = useSelector((i) => i.user);
  const {loadedId} = useSelector((i) => i.stream);

  // event handlers
  const handleFadeOut = (direction) => {
    setVisible(false);
    setChangeDirection(direction);
  };

  const handleFadeIn = () => {
    if (changeDirection === '+') setImageHeight(imageHeight + heightIncrement);
    if (changeDirection === '-') setImageHeight(imageHeight - heightIncrement);

    setVisible(true);
  };

  // fetches image using using authorization header
  React.useEffect(() => {
    // base url for image
    const srcBase = `${BACKEND_URL}/media/${loadedId}/${slice.id}_${slice.imageName}`; // eslint-disable-line no-undef

    // function adding authorization header to image request
    const srcAuthorized = async () => {
      const headers = {'Authorization': `Bearer ${token}`};
      const imageData = await fetch(srcBase, {headers});
      const imageBlob = await imageData.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageSrc(imageUrl);
    };

    srcAuthorized();

    // don't want a bunch of image urls clogging up memory
    return () => {
      URL.revokeObjectURL(imageSrc);
    };

  }, [slice]);

  if (!imageSrc) return null;

  return (
    <div className = 'slice-image-group-container'>
      <div
        className = 'slice-image-container'>
        <Transition
          animation = 'fade'
          duration = {200}
          onHide = {handleFadeIn}
          transitionOnMount = {false}
          visible = {visible}>
          <Image
            className = 'slice-image'
            style = {{maxHeight: `${imageHeight}vh`}}
            src = {imageSrc}/>
        </Transition>
      </div>
      <div className = 'slice-image-bottom-row'>
        <TagGroup slice = {slice}/>
        <div className = 'slice-image-size-button-container'>
          <Button
            compact
            disabled = {imageHeight === maxHeight}
            icon = 'plus'
            onClick = {() => handleFadeOut('+')}
            size = 'mini'/>
          <Button
            compact
            disabled = {imageHeight === minHeight}
            icon = 'minus'
            onClick = {() => handleFadeOut('-')}
            size = 'mini' />
        </div>
      </div>
    </div>
  );
};

const Slice = ({slice, myPermissions}) => {
  const defaultDeleteMessage = 'Are you sure you want to delete this slice?';

  const dispatch = useDispatch();
  const thisDate = new Date(slice.createdAt);
  const {loadedId} = useSelector((i) => i.stream);
  const {username} = useSelector((i) => i.user);
  const [isConfirm, setIsConfirm] = React.useState(false);
  const [deleteMessage, setDeleteMessage] = React.useState(defaultDeleteMessage);
  const [deleteSlice, result] = useDeleteSliceMutation();

  const canDelete = myPermissions.deleteAll
    || (myPermissions.deleteOwn && username === slice.user.username);

  // event handlers
  const handleDelete = async () => {
    try {
      // reset scroll location so it will start querying from beginning
      dispatch(resetScroller());
      await deleteSlice(slice.id).unwrap();
      // clears the cache for this stream
      dispatch(appApi.util.updateQueryData('getSlices', {streamId: loadedId}, () => {return [];}));
    } catch (error) {
      setDeleteMessage(error.data.error);
    }
  };

  const handleConfirmCancel = () => {
    setDeleteMessage(defaultDeleteMessage);
    result.reset();
    setIsConfirm(false);
  };

  return (
    <Transition
      animation = 'fade'
      duration = {500}
      transitionOnMount = {true}>
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
              {canDelete &&
            <div>
              <Button
                basic
                color = 'red'
                compact
                onClick = {() => setIsConfirm(true)}
                size = 'mini'>
                delete
              </Button>
              <Confirm
                confirmButton = {!result.isError && 'Delete'}
                content = {deleteMessage}
                header = 'Confirm slice deletion'
                open = {isConfirm}
                onCancel = {handleConfirmCancel}
                onConfirm = {handleDelete}
              />
            </div>}
            </div>
          </div>
          <div>
            {slice.text}
          </div>
          {!slice.imageName && <TagGroup slice = {slice} />}
          {slice.imageName && <SliceImage slice = {slice}/>}
        </div>
      </div>
    </Transition>
  );
};

const Slices = () => {
  const dispatch = useDispatch();
  const {loadedId, loadedName, scroller, search} = useSelector((i) => i.stream);
  // ref for element to add scroll event listener
  const scrollRef = React.useRef(0);

  const myPermissions = useGetMyPermissionsQuery(loadedId);
  const {data, isLoading, isError} = useGetSlicesQuery({
    streamId: loadedId,
    limit: scroller.limit,
    offset: scroller.offset,
    search: search
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
      {myPermissions?.data?.write && <CreateSlice />}
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
