import React from 'react';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router';
import {useRegisterUserMutation} from '../services/users';
import {Button, Form, FormField, Header} from 'semantic-ui-react';
import {NavButton} from '.';
import {clearPasswords, updateRegistration} from '../reducers/registrationReducer';

const TextField = ({varName, dispName, type = 'text'}) => {
  const dispatch = useDispatch();
  const thisRegistration = useSelector((i) => i.registration);

  // event handler
  const onType = (event) => {
    const {name, value} = event.target;
    dispatch(updateRegistration({[name]: value}));
  };

  return (
    <FormField>
      <label>{dispName}</label>
      <input
        type = {type}
        name = {varName}
        value = {thisRegistration[varName]}
        onChange = {onType}
        placeholder = {dispName}/>
    </FormField>
  );
};

const RegistrationForm = ({setIsRegistered}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const thisRegistration = useSelector((i) => i.registration);
  const [registerUser, result] = useRegisterUserMutation();

  const buttonLabel = result.isError
    ? result.error.data.error
    : 'register';

  // event handlers
  const handleSubmit = async () => {
    try {
      await registerUser(thisRegistration).unwrap();
      setIsRegistered(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    dispatch(clearPasswords());
    navigate('/');
  };

  // reset mutation after 5 seconds to clear error message
  if (result.error) {
    setTimeout(() => {
      result.reset();
    }, 5000);
  }

  return (
    <Form onSubmit = {handleSubmit}>
      <TextField
        varName = 'username'
        dispName = 'Username'/>
      <TextField
        varName = 'firstName'
        dispName = 'First Name'/>
      <TextField
        varName = 'lastName'
        dispName = 'Last Name'/>
      <TextField
        varName = 'email'
        dispName = 'Email' />
      <TextField
        type = 'password'
        varName = 'password'
        dispName = 'Password' />
      <TextField
        type = 'password'
        varName = 'passwordConfirm'
        dispName = 'Confirm Password'/>
      <div className=  'generic-flex-column '>
        <Button
          type = 'submit'>
          {buttonLabel}
        </Button>
        <Button
          type = 'button'
          onClick = {handleCancel}>
          cancel
        </Button>
      </div>
    </Form>
  );
};

const ConfirmationPage = () => {
  return (
    <div className = 'generic-flex-column'>
      Thank you for registering with Aika! Confirm your email to log in.
      <NavButton text = 'return home' path = '/'/>
    </div>
  );
};

const Register = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  return (
    <div className = 'generic-flex-column'>
      <Header size = 'large'>Register</Header>
      {isRegistered
        ? <ConfirmationPage />
        : <RegistrationForm setIsRegistered = {setIsRegistered}/>
      }
    </div>
  );
};

export default Register;