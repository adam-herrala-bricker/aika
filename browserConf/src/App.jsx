import React from 'react';
import {Routes, Route, useParams, useNavigate} from 'react-router-dom';
import {Button, Header} from 'semantic-ui-react'

const DefaultMessage = () => {
  return (
    <div>
      default message
    </div>
  )
}

const ConfirmationPage = () => {
  const {id} = useParams();
  return (
    <div>
      <div>
        confirmation page
      </div>
      <div>
        id number: {id}
      </div>
    </div>
  )
}


const App = () => {
  const nagivate = useNavigate();

  return (
    <div className = 'outer-container'>
      <div className = 'main-container'>
        <Header as = 'h1'>Aika Email Confirmation</Header>
        <Routes>
          <Route path = '/' element = {<DefaultMessage />}/>
          <Route path = '/:id' element = {<ConfirmationPage />}/>
        </Routes>
        <Button onClick={() => nagivate('/7')}>click</Button>

      </div>
    </div>
  )
}

export default App