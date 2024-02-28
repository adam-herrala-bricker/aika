import React from 'react';

const NewTabLink = ({url}) => {
  return (
    <a
      href = {url}
      rel = 'noreferrer'
      target = '_blank'>
      {url}
    </a>
  );
};

export default NewTabLink;
