import React from 'react';

const Tag = ({text, color = 'black'}) => {
  return (
    <div
      className = 'tag-container'
      style = {{color: color}}>
      {text}
    </div>
  );
};

const TagGroup = ({slice}) => {

  return (
    <div className = 'tag-group'>
      {slice.isMilestone && <Tag color = 'darkblue' text = 'milestone'/>}
      {slice.isPublic && <Tag color = 'teal' text = 'public'/>}
    </div>
  );
};

export default TagGroup;
