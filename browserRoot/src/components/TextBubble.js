import React from 'react';

const TitleText = ({title}) => {
  return (
    <div className = 'bubble-title'>
      {title}
    </div>
  );
};

const TextBubble = ({text, title, fluid = false, ...props}) => {
  return (
    <div className = {fluid ? 'bubble-container' : 'bubble-container-fixed'} {...props}>
      {title && <TitleText title = {title}/>}
      {text}
    </div>
  );
};

export default TextBubble;
