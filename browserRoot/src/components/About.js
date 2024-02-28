import React from 'react';
import {Image} from 'semantic-ui-react';
import PageHeader from './PageHeader';
import TextBubble from './TextBubble';
import text from '../assets/text';
import adamImage from '../assets/adam-thumbs-up.jpg';

const About = () => {
  return (
    <div className = 'about-container'>
      <PageHeader text = 'About'/>
      <div className = 'about-content-container'>
        <div className = 'about-image-group'>
          <Image className = 'about-image' src = {adamImage}/>
          <div className = 'about-image-caption'>
            {text.imageCaption}
          </div>
        </div>
        <TextBubble
          style = {{backgroundColor: '#F2F1E9'}}
          title = 'Our approach'
          text = {
            <div>
              <p>{text.aboutNT.p2}</p>
              <p>{text.aboutNT.p3}</p>
              <p>{text.aboutNT.p1}</p>
            </div>
          }/>
      </div>
    </div>
  );
};

export default About;
