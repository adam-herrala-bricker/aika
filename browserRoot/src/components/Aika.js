import React from 'react';
import NewTabLink from './NewTabLink';
import PageHeader from './PageHeader';
import TextBubble from './TextBubble';
import text from '../assets/text';

const Aika = () => {
  return (
    <div className = 'aika-container'>
      <PageHeader text = 'What is Aika?'/>
      <div className = 'aika-points-container'>
        <TextBubble
          fluid
          text = {text.aikaWhat}/>
      </div>
      <PageHeader text = 'Where is Aika?'/>
      <div className = 'aika-points-container'>
        <TextBubble
          title = 'Desktop + Mobile Browser'
          text = {<NewTabLink url = 'https://nastytoboggan.com/app'/>}/>
        <TextBubble
          title = 'Mobile App'
          text = 'Coming soon for iPhone and Android!'/>
      </div>
      <PageHeader text = 'Why is Aika?'/>
      <div className = 'aika-points-container'>
        <TextBubble
          title = 'Privacy and Transparency'
          text = {<div>
            <p>{text.points.privacy.p1}</p>
            <p>{text.points.privacy.p2}</p>
            <p><NewTabLink url = 'https://github.com/adam-herrala-bricker/aika'/></p>
          </div>}/>
        <TextBubble
          title = 'Beyond the reach of AI'
          text = {<div>
            <p>{text.points.noAI.p1}</p>
            <p>{text.points.noAI.p2}</p>
          </div>}/>
        <TextBubble
          title = 'Here for the long haul'
          text = {<div>
            <p>{text.points.longHaul.p1}</p>
            <p>{text.points.longHaul.p2}</p>
          </div>}/>
      </div>
    </div>
  );
};

export default Aika;
