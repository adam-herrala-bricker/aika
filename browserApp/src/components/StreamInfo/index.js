import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  useDeleteStreamMutation,
  useGetMyPermissionsQuery
} from '../../services/streams';
import {resetStream} from '../../reducers/streamReducer';
import {resetView, setStreamSliceMain} from '../../reducers/viewReducer';
import {Button, Confirm, Header} from 'semantic-ui-react';
import AllPermissions from './AllPermissions';
import ShareForm from './ShareForm';
import {ExpandBox} from '..';
import {permissionTypes} from '../../util/constants';

const ViewPermissions = ({data}) => {

  return (
    <div className = 'permission-bubble-container'>
      {permissionTypes.map((type) =>
        <div
          key = {type}
          className = {data[type] ? 'permission-bubble-yes' : 'permission-bubble-no'}>
          {type}
        </div>)}
    </div>
  );
};

const StreamInfo = () => {
  const dispatch = useDispatch();
  const [deleteStream, result] = useDeleteStreamMutation();

  const [isConfirm, setIsConfirm] = React.useState(false);
  const [deleteButton, setDeleteButton] = React.useState('Delete');
  const [deleteMessage, setDeleteMessage] = React.useState('Are you sure you want to delete this stream?');
  const {loadedId, loadedName} = useSelector((i) => i.stream);
  const {appWidth, mobileBreakpoint} = useSelector((i) => i.view);
  const {data, isLoading} = useGetMyPermissionsQuery(loadedId);

  // event handler
  const handleDelete = async () => {
    try {
      await deleteStream(loadedId).unwrap();
      dispatch(resetView());
      dispatch(resetStream());
    } catch (error) {
      setDeleteMessage(error.data.error);
      setDeleteButton(false); // hides the button
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className = {appWidth > mobileBreakpoint ? 'stream-info-container-browser' : 'stream-info-container-mobile'}>
      <div>
        <div className = 'stream-info-header-container'>
          <div>
            <Header size = 'large'>
              {loadedName}
            </Header>
          </div>
          <Button onClick = {() => dispatch(setStreamSliceMain('slice'))}>
            back
          </Button>
        </div>
        <div className = 'stream-info-body'>
          <ExpandBox renderOpen header = 'my permissions'>
            <ViewPermissions data = {data}/>
          </ExpandBox>
          {data.admin && <ExpandBox header = 'share with user'><ShareForm /></ExpandBox>}
          {data.admin && <ExpandBox header = 'all users with stream permissions'><AllPermissions /></ExpandBox>}
          {!result.isError && data.deleteAll &&
            <ExpandBox header = 'delete stream'>
              <Button
                onClick = {() => setIsConfirm(true)}
                color = 'red'>
                delete stream
              </Button>
            </ExpandBox>}
        </div>
        <Confirm
          confirmButton = {deleteButton}
          content = {deleteMessage}
          header = {`${loadedName} -  confirm deletion`}
          onCancel = {() => setIsConfirm(false)}
          onConfirm = {handleDelete}
          open = {isConfirm}
        />
      </div>
    </div>
  );
};

export default StreamInfo;
