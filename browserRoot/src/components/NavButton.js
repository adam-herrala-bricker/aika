import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Button} from 'semantic-ui-react';

const NavButton = ({text, path, ...props}) => {
  const navigate = useNavigate();

  return (
    <Button
      type = 'button'
      onClick={() => navigate(path)}
      {...props}>
      {text}
    </Button>
  );
};

export default NavButton;
