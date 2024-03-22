import React from 'react';
import {useNewStreamMutation} from '../services/streams';
import {Button, Form, FormField, Header, MenuItem} from 'semantic-ui-react';

const CreateForm = ({newStream, setIsOpen}) => {
  const [streamName, setStreamName] = React.useState('');

  // event handler
  const handleSubmit = () => {
    newStream({name: streamName});
    setIsOpen(false);
  };

  return (
    <Form onSubmit = {handleSubmit}>
      <FormField>
        <input
          type = 'text'
          name = 'newStream'
          onChange = {(event) => setStreamName(event.target.value)}
          placeholder = 'Stream name'
          value = {streamName} />
      </FormField>
      <Button
        compact
        fluid
        primary
        type = 'submit'>
        add stream
      </Button>
    </Form>
  );
};


// note this is currently set up to live in a Menu
const CreateStream = () => {
  // "open" = the menu is open to create a new stream
  const [isOpen, setIsOpen] = React.useState(false);
  const [newStream, result] = useNewStreamMutation();
  const thisLabel = result.isError
    ? result.error.data.error
    : 'New Stream';


  // reset five seconds after error
  if (result.isError) {
    setTimeout(() => {
      result.reset();
    }, 5000);
  }

  return (
    <div className = 'create-stream-container'>
      <MenuItem
        disabled = {result.isError}
        onClick = {() => setIsOpen(!isOpen)}>
        <Header size = 'medium'>{thisLabel}</Header>
      </MenuItem>
      {isOpen && <MenuItem><CreateForm newStream = {newStream} setIsOpen = {setIsOpen}/></MenuItem>}
    </div>
  );
};

export default CreateStream;
