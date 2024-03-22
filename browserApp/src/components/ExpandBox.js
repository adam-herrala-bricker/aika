import React from 'react';
import {Icon} from 'semantic-ui-react';

const ExpandBox = ({header, child}) => {
  const [showChild, setShowChild] = React.useState(false);
  return (
    <div className = 'expand-box'>
      <div className = 'expand-header-container'>
        <Icon
          className = 'icon-angle'
          name = {showChild ? 'angle down' : 'angle right'}
          onClick = {() => setShowChild(!showChild)}
          size = 'large' />
        <div className = 'expand-header-text'>
          {header}
        </div>
      </div>
      {showChild &&
      <div className = 'expand-body-container'>
        {child}
      </div>}
    </div>
  );
};

export default ExpandBox;
