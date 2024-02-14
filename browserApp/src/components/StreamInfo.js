import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {
  useDeleteStreamMutation,
  useGetPermissionsQuery
} from '../services/streams';
import {resetStream} from '../reducers/streamReducer';
import {resetView} from '../reducers/viewReducer';
import {Button, Confirm, Header} from 'semantic-ui-react';
import {NavButton, ShareForm} from '.';
import {permissionTypes} from '../util/constants';



const ViewPermissions = ({permissionsResponse}) => {
  const {data} = permissionsResponse;

  return (
    <div className = 'permissions-display-container'>
      <Header size = 'small'>my permissions</Header>
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

const StreamInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deleteStream, result] = useDeleteStreamMutation();

  const [isConfirm, setIsConfirm] = React.useState(false);
  const [deleteButton, setDeleteButton] = React.useState('Delete');
  const [deleteMessage, setDeleteMessage] = React.useState('Are you sure you want to delete this stream?');
  const {loadedId, loadedName} = useSelector((i) => i.stream);
  const permissionsResponse = useGetPermissionsQuery(loadedId);

  // event handler
  const handleDelete = async () => {
    try {
      await deleteStream(loadedId).unwrap();
      dispatch(resetView());
      dispatch(resetStream());
      navigate('/');
    } catch (error) {
      setDeleteMessage(error.data.error);
      setDeleteButton(false); // hides the button
    }
  };

  if (permissionsResponse.isLoading) {
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
          <NavButton text = 'back' path = '/'/>
        </div>
        <ViewPermissions permissionsResponse = {permissionsResponse}/>
        {permissionsResponse.data.admin && <ShareForm />}
      </div>
      <div>
        {!result.isError &&
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
