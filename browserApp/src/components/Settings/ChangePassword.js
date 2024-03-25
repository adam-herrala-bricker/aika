import React from 'react';
import {useChangePasswordMutation} from '../../services/users';
import {Button, Form, FormField, Input} from 'semantic-ui-react';

const ChangePassword = () => {
  const [changePassword, result] = useChangePasswordMutation();
  const buttonLabel = result.isError
    ? result.error.data.error
    : result.isSuccess
      ? 'Password successfully changed!'
      : 'Submit';

  const defaultPassword = {old: '', new:'', confirm: ''};
  const [password, setPassword] = React.useState(defaultPassword);

  const passwordsMatch = password.new === password.confirm;
  const confirmText = passwordsMatch ? 'matches' : 'does not match';

  const passwordTooShort = password.new.length < 8;

  const handleChangePassword = async () => {
    await changePassword({
      oldPassword: password.old,
      newPassword: password.new
    });
    setPassword(defaultPassword);
  };

  // reset mutation after 5 seconds to clear error/ success message
  if (result.isError || result.isSuccess) {
    setTimeout(() => {
      result.reset();
    }, 5000);
  }

  return (
    <Form onSubmit = {handleChangePassword}>
      <FormField>
        <label>current password</label>
        <Input
          onChange = {(event) => setPassword({...password, old: event.target.value})}
          placeholder = 'current password'
          type = 'password'
          value = {password.old} />
      </FormField>
      <FormField>
        <label>new password</label>
        <Input
          label = {{
            basic: password.new === '',
            color: passwordTooShort ? 'red' : 'green',
            content: passwordTooShort ? 'too short' : 'good'
          }}
          labelPosition = 'right'
          onChange = {(event) => setPassword({...password, new: event.target.value})}
          placeholder = 'new password'
          type = 'password'
          value = {password.new} />
      </FormField>
      <FormField>
        <label>confirm new password</label>
        <Input
          label = {{
            basic: passwordTooShort,
            color: passwordTooShort ? 'grey' :
              passwordsMatch ? 'green' : 'red',
            content: confirmText
          }}
          labelPosition = 'right'
          onChange = {(event) => setPassword({...password, confirm: event.target.value})}
          placeholder = 'confirm password'
          type = 'password'
          value = {password.confirm} />
      </FormField>
      <Button
        className = {(result.isError || result.isSuccess) ? 'button-unchange-on-disable': 'button'}
        color = 'vk'
        disabled = {passwordTooShort || !passwordsMatch}
        negative = {result.isError}
        positive = {result.isSuccess}
        type = 'submit'>
        {buttonLabel}
      </Button>
      <Button
        onClick = {() => setPassword(defaultPassword)}
        type = 'reset'>
        Cancel
      </Button>
    </Form>
  );
};

export default ChangePassword;
