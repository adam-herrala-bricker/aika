import React from 'react';
import {useDispatch} from 'react-redux';
import {useDeleteAccountMutation} from '../../services/users';
import {logOut} from '../../reducers/userReducer';
import {Button, Confirm, Input} from 'semantic-ui-react';

const DeleteAccount = () => {
  const defaultConfirmText = 'Are you sure you want to permanently delete your account? This cannot be undone.';
  const dispatch = useDispatch();

  const [activeConfirm, setActiveConfirm] = React.useState(false);
  const [password, setPassword] = React.useState('');

  const [deleteAccount, result] = useDeleteAccountMutation();

  const confirmText = result.isError
    ? result.error.data.error
    : defaultConfirmText;

  const handleDelete = async () => {
    await deleteAccount({password});
    setPassword('');
  };

  const handleCancel = () => {
    result.reset();
    setActiveConfirm(false);
  };

  if (result.isSuccess) {
    dispatch(logOut());
  }

  return (
    <div className = 'delete-account-container'>
      <div>
        <Input
          onChange = {(event) => setPassword(event.target.value)}
          placeholder = 'confirm password'
          type = 'password'
          value = {password}/>
      </div>
      <div>
        <Button
          disabled = {password.length < 8}
          negative
          onClick = {() => setActiveConfirm(true)}>
            Delete account
        </Button>
      </div>
      <Confirm
        confirmButton = {!result.isError && 'Yes'}
        content = {confirmText}
        header = 'Confirm account deletion'
        onCancel = {handleCancel}
        onConfirm = {handleDelete}
        open = {activeConfirm}
      />
    </div>
  );
};

export default DeleteAccount;
