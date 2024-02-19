import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNewSliceMutation} from '../services/slices';
import {resetScroller} from '../reducers/streamReducer';
import {clearSlice, updateSlice} from '../reducers/sliceReducer';
import {urlToBlob} from '../util/helpers';
import {
  Button,
  Form,
  FormInput,
  FormGroup,
  FormTextArea,
  Header,
  Image,
} from 'semantic-ui-react';

const CreateSlice = () => {
  const maxTitleLen = 32;
  const maxTextLen = 512;
  const defaultImageMessage = 'Upload image';
  const dispatch = useDispatch();
  const [newSlice, result] = useNewSliceMutation();
  const thisSlice = useSelector((i) => i.slice);
  const {loadedId} = useSelector((i) => i.stream);
  const [hidden, setHidden] = React.useState(true);
  const [titleError, setTitleError] = React.useState(false);
  const [textError, setTextError] = React.useState(false);
  const [imageName, setImageName] = React.useState(defaultImageMessage);

  const buttonLabel = result.isError
    ? result.error.data.error
    : 'Slice';

  // event handlers
  const handleCancel = () => {
    dispatch(clearSlice());
    setTitleError(false);
    setTextError(false);
    setImageName(defaultImageMessage);
    setHidden(true);
  };

  const handleTitleChange = (event) => {
    if (event.target.value.length < maxTitleLen) {
      setTitleError(false);
      dispatch(updateSlice({title: event.target.value}));
    } else {
      setTitleError(true);
    }
  };

  const handleTextChange = (event) => {
    if (event.target.value.length < maxTextLen) {
      setTextError(false);
      dispatch(updateSlice({text: event.target.value}));
    } else {
      setTextError(true);
    }
  };

  const handleUpload = async (event) => {
    setImageName(event.target.files[0].name);
    // there will only ever be one file uploaded at a time
    const imageUrl = URL.createObjectURL(event.target.files[0]);
    dispatch(updateSlice({imageUrl}));
  };

  const submitSlice = async () => {
    // resets the scroller so that query will get new slice
    dispatch(resetScroller());
    const imageBlob = await urlToBlob(thisSlice.imageUrl);
    try {
      await newSlice({
        slice: {
          ...thisSlice,
          image: imageBlob},
        streamId: loadedId}).unwrap();
      dispatch(clearSlice());
      setTitleError(false);
      setTextError(false);
      setImageName(defaultImageMessage);
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
            error = {titleError}
            name = 'title'
            onChange = {handleTitleChange}
            placeholder = 'Title'
            value = {thisSlice.title}/>
          <Button
            basic = {!thisSlice.isMilestone}
            color = 'vk'
            onClick = {() => dispatch(updateSlice({isMilestone: !thisSlice.isMilestone}))}
            size = 'small'
            type = 'button'>
              Milestone
          </Button>
          <Button
            basic = {!thisSlice.isPublic}
            color = 'vk'
            onClick = {() => dispatch(updateSlice({isPublic: !thisSlice.isPublic}))}
            size = 'small'
            type = 'button'>
              Public
          </Button>
        </FormGroup>
        <Header size = 'tiny'>Image</Header>
        <FormGroup>
          <FormInput
            id = 'file'
            multiple = {false}
            onChange = {handleUpload}
            style = {{display: 'none'}}
            type = 'file'/>
          <Button
            as = 'label'
            basic
            htmlFor = 'file'
            type = 'button'>
            {imageName}
          </Button>
        </FormGroup>
        {thisSlice.imageUrl !== '' &&
        <FormGroup>
          <div className = 'slice-image-preview'>
            <Image
              size = 'tiny'
              src = {thisSlice.imageUrl}/>
          </div>
        </FormGroup>
        }
        <FormTextArea
          error = {textError}
          label = 'Text'
          name = 'text'
          onChange = {handleTextChange}
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
            onClick = {handleCancel}
            type = 'button'>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateSlice;
