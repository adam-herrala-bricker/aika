import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setSharing, resetSharing} from '../reducers/sharingReducer';
import {useSetPermissionsMutation} from '../services/permissions';
import {Button, Confirm, Form, FormField, Header, Popup} from 'semantic-ui-react';
import {permissionPopup, permissionTypes} from '../util/constants';

const ShareOption = ({type}) => {
  const dispatch = useDispatch();
  const sharing = useSelector((i) => i.sharing);

  return (<div>
    <Popup
      content = {permissionPopup[type]}
      trigger = {
        <Button
          basic = {!sharing[type]}
          color = {sharing[type] ? 'vk' : 'grey'}
          compact
          onClick = {() => dispatch(setSharing({[type]: !sharing[type]}))}
          type = 'button'>
          {type}
        </Button>
      }/>
  </div>
  );
};

const ShareForm = () => {
  const dispatch = useDispatch();
  const sharing = useSelector((i) => i.sharing);
  const {loadedId} = useSelector((i) => i.stream);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [setPermissions] = useSetPermissionsMutation();

  // even handler
  const handleSubmit = () => {
    setPermissions({streamId: loadedId, body: sharing});
    dispatch(resetSharing());
    setShowConfirm(true);
  };

  return (
    <div className = 'share-form-container'>
      <Form onSubmit = {handleSubmit}>
        <Header size = 'small'>share with user</Header>
        <FormField>
          <label>username</label>
          <input
            onChange = {(event) => dispatch(setSharing({username: event.target.value}))}
            placeholder = 'username'
            value = {sharing.username}
          />
        </FormField>
        <FormField>
          <label>options</label>
          <div className = 'share-options-container'>
            {permissionTypes.map((type) =>
              <ShareOption key = {type} type = {type} />
            )}
          </div>
        </FormField>
        <Button
          fluid
          primary
          type = 'submit'>
          share
        </Button>
      </Form>
      <Confirm
        cancelButton = {false}
        content = 'Your share request has been sent.'
        header = 'Share confirmation'
        onConfirm = {() => setShowConfirm(false)}
        open = {showConfirm}
      />
    </div>
  );
};

export default ShareForm;
