import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {updateSlice} from '../../reducers/sliceReducer';
import {clearStreamCache, setStrand} from '../../reducers/streamReducer';
import {setCreateSliceHidden} from '../../reducers/viewReducer';
import {Button} from 'semantic-ui-react';

const OptionsOpen = ({slice, setOpen}) => {
  const {loadedId, strand} = useSelector((i) => i.stream);
  const dispatch = useDispatch();

  const handleCreateStrandSlice = () => {
    dispatch(updateSlice({strandName: slice.strand.name}));
    dispatch(setCreateSliceHidden(false));
    setOpen(false);
  };

  const handleSelectStrand = () => {
    dispatch(clearStreamCache(loadedId));
    dispatch(setStrand(slice.strand));
    setOpen(false);
  };

  return (
    <div>
      <Button
        basic
        color = 'black'
        compact
        disabled = {strand.id ? true : false}
        icon = 'code branch'
        onClick = {handleCreateStrandSlice}
        size = 'mini'/>
      <Button
        basic
        color = 'black'
        compact
        disabled = {strand.id ? true : false}
        icon = 'filter'
        onClick = {handleSelectStrand}
        size = 'mini'/>
    </div>
  );
};

const StrandOptions = ({slice}) => {
  const [optionsOpen, setOptionsOpen] = React.useState(false);

  if (!slice.strand) return null;

  return (
    <div className = 'slice-strand-options'>
      {optionsOpen && <OptionsOpen slice = {slice} setOpen = {setOptionsOpen}/>}
      <Button
        basic
        color = 'black'
        compact
        onClick={() => setOptionsOpen(!optionsOpen)}
        size = 'mini'>
        {slice.strand.name}
      </Button>
    </div>
  );
};

export default StrandOptions;
