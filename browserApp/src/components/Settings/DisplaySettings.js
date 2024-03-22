import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setImageRes} from '../../reducers/viewReducer';
import {Checkbox} from 'semantic-ui-react';

const DisplaySettings = () => {
  const dispatch = useDispatch();
  const {imageRes} = useSelector((i) => i.view);

  // setting this up in anticipation of more than two res options
  const toggleImageRes = () => {
    if (imageRes === 'full') {
      dispatch(setImageRes('web'));
    } else if (imageRes === 'web') {
      dispatch(setImageRes('full'));
    }
  };

  return (
    <div>
      <Checkbox
        checked = {imageRes === 'full'}
        label = 'full res images'
        onChange = {toggleImageRes}
        toggle/>
    </div>
  );
};

export default DisplaySettings;
