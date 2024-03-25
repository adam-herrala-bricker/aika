import React from 'react';
import {Icon} from 'semantic-ui-react';

const ExpandBox = ({header, renderOpen, children}) => {
  const [showChild, setShowChild] = React.useState(renderOpen);
  return (
    <div className = 'expand-box'>
      <div
        className = 'expand-header-container'
        onClick = {() => setShowChild(!showChild)}>
        <Icon
          name = {showChild ? 'angle down' : 'angle right'}
          size = 'large' />
        <div className = 'expand-header-text'>
          {header}
        </div>
      </div>
      {showChild &&
      <div className = 'expand-body-container'>
        {children}
      </div>}
    </div>
  );
};

export default ExpandBox;
