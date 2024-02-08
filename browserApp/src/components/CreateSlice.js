import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNewSliceMutation} from '../services/slices';
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

  const buttonLabel = result.isError
    ? result.error.data.error
    : 'Slice';

  // event handler
  const submitSlice = async () => {
    try {
      await newSlice({slice: thisSlice, streamId: loadedId});
      dispatch(clearSlice());
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

  return (
    <div>
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
        <Button
          fluid
          type = 'submit'>
          {buttonLabel}
        </Button>
      </Form>
    </div>
  );
};

export default CreateSlice;
