import React from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router';
import {useLoginUserMutation} from '../services/users';
import {setUser} from '../reducers/userReducer';
import {Button, Header} from 'semantic-ui-react';
import {NavButton} from '.';

const LogIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginUser, result] = useLoginUserMutation();

  const buttonLabel = result.isError
    ? result.error.data.error
    : 'submit';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // event handler
  const handleSubmit = async () => {
    try {
      const result = await loginUser({username, password}).unwrap();
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
    <div>
      <Header size = 'large'>Log In</Header>
      <div className = 'generic-flex-column'>
        <div className = 'ui input'>
          <input
            type = 'text'
            name = 'username'
            value = {username}
            onChange = {(event) => setUsername(event.target.value)}
            placeholder = 'username' />
        </div>
        <div className = 'ui input'>
          <input
            type = 'password'
            name = 'password'
            value = {password}
            onChange = {(event) => setPassword(event.target.value)}
            placeholder = 'password' />
        </div>
        <Button onClick = {handleSubmit}>{buttonLabel}</Button>
        <NavButton text = 'cancel' path = '/'/>
      </div>
    </div>
  );
};

export default LogIn;
