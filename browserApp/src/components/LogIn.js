import React from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router';
import {useLoginUserMutation} from '../services/users';
import {setUser} from '../reducers/userReducer';
import {Button, Header, Form, FormField, Input} from 'semantic-ui-react';
import {NavButton} from '.';

const LogIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginUser, result] = useLoginUserMutation();

  const buttonLabel = result.isError
    ? result.error.data.error
    : 'submit';

  const [credentials, setCredentials] = useState(''); // username or email
  const [password, setPassword] = useState('');

  // event handler
  const handleSubmit = async () => {
    try {
      const result = await loginUser({credentials, password}).unwrap();
      dispatch(setUser(result));
      navigate('/');
    } catch (error) {
      console.log(error); // do we need anything here? maybe check if it's an expected error?
    }
  };

  // reset mutation after 5 seconds to clear error message
  if (result.error) {
    setTimeout(() => {
      result.reset();
    }, 5000);
  }

  return (
    <div className = 'generic-flex-column'>
      <Form onSubmit = {handleSubmit}>
        <Header size = 'large'>Log In</Header>
        <FormField>
          <Input
            autoCapitalize = 'off'
            autoCorrect = 'off'
            type = 'text'
            name = 'username'
            value = {credentials}
            onChange = {(event) => setCredentials(event.target.value)}
            placeholder = 'username or email' />
        </FormField>
        <FormField>
          <Input
            type = 'password'
            name = 'password'
            value = {password}
            onChange = {(event) => setPassword(event.target.value)}
            placeholder = 'password' />
        </FormField>
        <div className = 'generic-flex-column'>
          <Button type = 'submit' primary>{buttonLabel}</Button>
          <NavButton text = 'cancel' path = '/'/>
        </div>
      </Form>
    </div>
  );
};

export default LogIn;
