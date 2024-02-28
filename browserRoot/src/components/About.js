import React from 'react';
import {Image} from 'semantic-ui-react';
import text from '../assets/text';
import adamImage from '../assets/adam-thumbs-up.jpg';

const About = () => {
  return (
    <div className = 'about-container'>
      <div className = 'page-header'>
        About us
      </div>
      <div className = 'about-content-container'>
        <div className = 'about-image-group'>
          <Image className = 'about-image' src = {adamImage}/>
          <div className = 'about-image-caption'>
            {text.imageCaption}
          </div>
        </div>
        <div className = 'about-text'>
          {text.about}
        </div>
      </div>
    </div>
  );
};

export default About;
