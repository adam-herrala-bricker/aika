import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNewSliceMutation} from '../services/slices';
import {resetScroller} from '../reducers/streamReducer';
import {clearSlice, updateSlice} from '../reducers/sliceReducer';
import {
  Button,
  Form,
  FormInput,
  FormGroup,
  FormTextArea,
  Header,
} from 'semantic-ui-react';

const CreateSlice = () => {
  const dispatch = useDispatch();
  const [newSlice, result] = useNewSliceMutation();
  const thisSlice = useSelector((i) => i.slice);
  const {loadedId} = useSelector((i) => i.stream);
  const [hidden, setHidden] = React.useState(true);

  const buttonLabel = result.isError
    ? result.error.data.error
    : 'Slice';

  // event handler
  const submitSlice = async () => {
    // resets the scroller so that query will get new slice
    dispatch(resetScroller());
    try {
      await newSlice({slice: thisSlice, streamId: loadedId}).unwrap();
      dispatch(clearSlice());
      setHidden(true);
    } catch (error) {
      console.log(error); // will want to improve the error handling here
    }
  };

  // reset error after 5 seconds
  if (result.isError) {
    setTimeout(() => {
      result.reset();
    }, 5000);
  }

  if (hidden) {
    return (
      <div className = 'slice-create-container-closed'>
        <Button
          fluid
          onClick = {() => setHidden(false)}
          primary>
          New Slice
        </Button>
      </div>
    );
  }

  return (
    <div className = 'slice-create-container-open'>
      <Header size = 'medium'>New Slice</Header>
      <Form onSubmit = {submitSlice}>
        <Header size = 'tiny'>Title</Header>
        <FormGroup>
          <FormInput
            onChange = {(e) => dispatch(updateSlice({title: e.target.value}))}
            name = 'title'
            placeholder = 'Title'
            value = {thisSlice.title}/>
          <Button
            basic = {!thisSlice.isMilestone}
            color = {thisSlice.isMilestone ? 'green' : 'vk'}
            onClick = {() => dispatch(updateSlice({isMilestone: !thisSlice.isMilestone}))}
            size = 'small'
            type = 'button'>
              Milestone
          </Button>
          <Button
            basic = {!thisSlice.isPublic}
            color = {thisSlice.isPublic ? 'green' : 'vk'}
            onClick = {() => dispatch(updateSlice({isPublic: !thisSlice.isPublic}))}
            size = 'small'
            type = 'button'>
              Public
          </Button>
        </FormGroup>
        <FormTextArea
          onChange = {(e) => dispatch(updateSlice({text: e.target.value}))}
          label = 'Text'
          name = 'text'
          placeholder = 'Text'
          value = {thisSlice.text}/>
        <div className = 'slice-button-container'>
          <Button
            fluid
            primary
            type = 'submit'>
            {buttonLabel}
          </Button>
          <Button
            fluid
            onClick = {() => setHidden(true)}
            type = 'button'>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateSlice;