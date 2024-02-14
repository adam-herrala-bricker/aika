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
  const {username} = useSelector((i) => i.user);
  const headerText = (!data.user)
    ? 'my permissions'
    : data.user?.username;

  if (data.user?.username === username) return null;

  return (
    <div className = 'permissions-display-container'>
      <Header size = 'small'>
        {headerText}
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
  const {data, isLoading} = useGetAllPermissionsQuery(loadedId);

  if (isLoading) return null;

  return (
    <div>
      {data.map((permissions) =>
        <ViewPermissions
          key = {permissions.id}
          data = {permissions}/>
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
        {!result.isError && data.admin &&
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
