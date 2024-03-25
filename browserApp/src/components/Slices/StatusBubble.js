import React from 'react';
import {Loader} from 'semantic-ui-react';

const StatusBar = ({isFetching, loadedN}) => {
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

  if (hide) return null;

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

  return (
    <div
      className = 'slice-status-bubble'
      onClick = {() => setHide(true)}>
      {loadedN} slices loaded
    </div>
  );
};

export default StatusBar;
