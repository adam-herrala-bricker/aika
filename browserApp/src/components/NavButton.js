import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Button} from 'semantic-ui-react';

const NavButton = ({text, path}) => {
  const navigate = useNavigate();

  return (
    <Button onClick={() => navigate(path)}>
      {text}
    </Button>
  );
};

export default NavButton;
