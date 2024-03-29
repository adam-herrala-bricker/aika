import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {appApi} from '../../services/config';
import {resetScroller} from '../../reducers/streamReducer';
import {useDeleteSliceMutation} from '../../services/slices';
import {Button, Header, Icon, Modal, ModalActions, ModalContent, Transition} from 'semantic-ui-react';
import {customDateFormat, howLongAgo} from '../../util/helpers';
import SliceImage from './SliceImage';
import StrandOptions from './StrandOptions';
import TagGroup from './TagGroup';


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
      <div className = 'slice-single-super-container'>
        <div className = 'slice-single-time-container'>
          <div>{howLongAgo(thisDate)}</div>
          <div className = 'slice-single-date-text'>
            {customDateFormat(thisDate)}
          </div>
        </div>
        <div className = 'slice-single-container'>
          <div className = 'slice-single-top-row'>
            <div className = 'slice-user-group'>
              <div className = 'slice-single-user-button'>
                <div className = 'slice-single-user-button-text'>
                  {slice.user.firstName[0]}
                </div>
              </div>
              <div className = 'slice-single-column'>
                {`${slice.user.firstName} ${slice.user.lastName}`}
                <div className = 'slice-username-container'>
                  <i>{slice.user.username}</i>
                </div>
              </div>
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
              <Modal
                basic
                open = {isConfirm}>
                <Header>
                  <Icon name = 'trash alternate outline'/>
                  Confirm slice deletion
                </Header>
                <ModalContent>
                  {deleteMessage}
                </ModalContent>
                <ModalActions>
                  <Button
                    inverted
                    onClick = {handleConfirmCancel}>
                    Cancel
                  </Button>
                  <Button
                    color = 'red'
                    inverted
                    loading = {!result.isUninitialized}
                    onClick = {handleDelete}>
                    Delete
                  </Button>
                </ModalActions>
              </Modal>
            </div>}
            </div>
          </div>
          <div className = 'slice-header-container'>
            <div className = 'expand-header-text'>{slice.title}</div>
            <StrandOptions slice = {slice}/>
          </div>
          <div className = 'slice-text-container'>
            {slice.text}
          </div>
          {!slice.imageName && <div className = 'slice-tag-solo-container'><TagGroup slice = {slice} /></div>}
          {slice.imageName && <SliceImage slice = {slice}/>}
        </div>
      </div>
    </Transition>
  );
};

export default Slice;
