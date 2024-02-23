import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  useDeleteStreamMutation,
  useGetAllPermissionsQuery,
  useGetMyPermissionsQuery
} from '../services/streams';
import {resetStream} from '../reducers/streamReducer';
import {resetView, setStreamSliceMain} from '../reducers/viewReducer';
import {Button, Confirm, Header} from 'semantic-ui-react';
import {ShareForm} from '.';
import {permissionTypes} from '../util/constants';

const ViewPermissions = ({data}) => {

  return (
    <div className = 'permissions-display-container'>
      <Header size = 'small'>
        my permissions
      </Header>
      <div className = 'permission-bubble-container'>
        {permissionTypes.map((type) =>
          <div
            key = {type}
            className = {data[type] ? 'permission-bubble-yes' : 'permission-bubble-no'}>
            {type}
          </div>)}
      </div>
    </div>
  );
};

const AllPermissions = () => {
  const {loadedId} = useSelector((i) => i.stream);
  const {username} = useSelector((i) => i.user);
  const {data, isLoading} = useGetAllPermissionsQuery(loadedId);

  if (isLoading) return null;

  return (
    <div className = 'permissions-display-container'>
      <Header size = 'medium'>all users with stream permissions</Header>
      {data.map((permissions) =>
        <div key = {permissions.id} className = 'permissions-shared-container'>
          <Header size = 'tiny'>
            {permissions.user.username === username
              ? 'me'
              : permissions.user.username}
          </Header>
          <div className = 'permission-bubble-container'>
            {permissionTypes.map((type) =>
              <div
                className = {permissions[type] ? 'permission-bubble-yes' : 'permission-bubble-no'}
                key = {type}>
                {type}
              </div>)}
          </div>
        </div>
      )}
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
    <div className = 'stream-info-container'>
      <div>
        <div className = 'stream-info-header-container'>
          <div>
            <Header size = 'medium'>
              {loadedName} settings
            </Header>
          </div>
          <Button onClick = {() => dispatch(setStreamSliceMain('slice'))}>
            back
          </Button>
        </div>
        <ViewPermissions data = {data}/>
        {data.admin && <ShareForm />}
        {data.admin && <AllPermissions />}
      </div>
      <div>
        {!result.isError && data.deleteAll &&
        <div className = 'stream-delete-container'>
          <Header size = 'small'>delete stream</Header>
          <Button
            onClick = {() => setIsConfirm(true)}
            color = 'red'>
            delete stream
          </Button>
        </div>}
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
