import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {clearStreamCache} from '../../reducers/streamReducer';
import {Loader} from 'semantic-ui-react';

const StatusBubble = ({isFetching, loadedN}) => {
  const dispatch = useDispatch();
  const {loadedId, strand} = useSelector((i) => i.stream);
  const [hide, setHide] = React.useState(false);

  // effect hook to handle timeout
  React.useEffect(() => {
    const hideLatency = 5; // in seconds
    setHide(false);

    if (!isFetching) {
      const thisTimeout = setTimeout(() => {
        setHide(true);
      }, hideLatency * 1000);

      return () => clearTimeout(thisTimeout);
    }

  }, [isFetching, loadedN]);

  if (hide && !strand.name) return null;

  // top priority: show circle when fetching
  if (isFetching) {
    return (
      <div className = 'slice-status-bubble'>
        <Loader
          active
          inline
          inverted
          size = 'tiny'/>
      </div>
    );
  }

  // if there's a strand loaded, it will continue to show that when it would other hide
  if (hide && strand.name) {
    return (
      <div
        className = 'slice-status-bubble'
        onClick = {() => dispatch(clearStreamCache(loadedId))}>
        Viewing strand: {strand.name}
      </div>
    );
  }

  // fallback --> loaded slices
  return (
    <div
      className = 'slice-status-bubble'
      onClick = {() => setHide(true)}>
      {loadedN} slices loaded
    </div>
  );
};

export default StatusBubble;
