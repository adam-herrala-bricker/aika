import React from 'react';
import {Routes, Route, useParams, useNavigate} from 'react-router-dom';
import {Button, Header} from 'semantic-ui-react'
import {confirmEmail} from './services';

const basePath = '/email-confirmation'; // this needs to match the path on the backend

const SuccessPage = () => {
  return (
    <div>
      Email successfully confirmed! You can now log into Aika.
    </div>
  )
}

const FailurePage = () => {
  return (
    <div>
      Something went wrong. Please retry the confirmation link.
    </div>
  )
}

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const {id} = useParams();

  const handleConfirm = async () => {
    try {
      await confirmEmail(id);
      navigate(`${basePath}/success`);
    } catch (error) {
      navigate(`${basePath}/failure`);
    }
  }

  return (
    <div className = 'conf-container'>
      <div></div>
      <div>
        Thank you for registering with Aika! To confirm your email, please press the button below.
      </div>
      <div>
        <Button onClick = {handleConfirm}>press to confirm</Button>
      </div>
    </div>
  )
}

const App = () => {
  return (
    <div className = 'outer-container'>
      <div className = 'main-container'>
        <div>
          <Header as = 'h1'>Aika Email Confirmation</Header>
        </div>
        <div className = 'route-container'>
          <Routes>
            <Route path = {`${basePath}/:id`} element = {<ConfirmationPage />}/>
            <Route path = {`${basePath}/success`} element = {<SuccessPage />}/>
            <Route path = {`${basePath}/failure`} element = {<FailurePage />}/>
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App