import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {useDeleteStreamMutation} from '../services/streams';
import {resetStream} from '../reducers/streamReducer';
import {resetView} from '../reducers/viewReducer';
import {Button, Confirm, Header} from 'semantic-ui-react';
import {NavButton} from '.';

const StreamInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deleteStream, result] = useDeleteStreamMutation();

  const [isConfirm, setIsConfirm] = React.useState(false);
  const [deleteButton, setDeleteButton] = React.useState('Delete');
  const [deleteMessage, setDeleteMessage] = React.useState('Are you sure you want to delete this stream?');
  const {loadedId, loadedName} = useSelector((i) => i.stream);

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

  return (
    <div className = 'stream-info-container'>
      <Header size = 'medium'>
        {loadedName} settings
      </Header>
      <div>
        {!result.isError &&
        <Button
          onClick = {() => setIsConfirm(true)}
          color = 'red'>
          delete stream
        </Button>}
        <NavButton text = 'back' path = '/'/>
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