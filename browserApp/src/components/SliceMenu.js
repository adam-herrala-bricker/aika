import React from 'react';
import {Button, Header, Input} from 'semantic-ui-react';

const SliceMenu = ({loadedName}) => {
  return (
    <div className = 'menu-slice-container'>
      <Button
        color = 'black'
        compact>
        <Header inverted>
          {loadedName}
        </Header>
      </Button>
      <Input
        className = 'stretchy'
        icon = 'search'
        placeholder = 'search stream . . .'/>
    </div>
  );
};

export default SliceMenu;
