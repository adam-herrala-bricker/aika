import React from 'react';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router';
import {useRegisterUserMutation} from '../services/users';
import {Button, Form, FormField, Header, Input} from 'semantic-ui-react';
import {NavButton} from '.';
import {clearPasswords, updateRegistration} from '../reducers/registrationReducer';

const TextField = ({varName, dispName, type = 'text', ...props}) => {
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
      <Input
        type = {type}
        name = {varName}
        value = {thisRegistration[varName]}
        onChange = {onType}
        placeholder = {dispName}
        {...props}/>
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

  // password checking
  const passwordsMatch = thisRegistration.password === thisRegistration.passwordConfirm;
  const passwordTooShort = thisRegistration.password.length < 8;
  const confirmText = passwordsMatch ? 'matches' : 'does not match';

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
  if (result.isError) {
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
        dispName = 'Password'
        label = {{
          basic: thisRegistration.password === '',
          content: passwordTooShort ? 'too short' : 'good',
          color: passwordTooShort ? 'red' : 'green'
        }}
        labelPosition = 'right'/>
      <TextField
        type = 'password'
        varName = 'passwordConfirm'
        dispName = 'Confirm Password'
        label = {{
          basic: passwordTooShort,
          color: passwordTooShort ? 'grey' :
            passwordsMatch ? 'green' : 'red',
          content: confirmText
        }}
        labelPosition = 'right'/>
      <div className=  'generic-flex-column '>
        <Button
          disabled = {!passwordsMatch || passwordTooShort}
          negative = {result.isError}
          primary = {!result.isError}
          type = {result.isError ? 'button' : 'submit'}>
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
    <div className = 'registration-container'>
      <Header size = 'large'>Register</Header>
      {isRegistered
        ? <ConfirmationPage />
        : <RegistrationForm setIsRegistered = {setIsRegistered}/>
      }
    </div>
  );
};

export default Register;