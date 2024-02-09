import {timeLevels} from './constants';

// function to sort slices by createdAt (newest first)
export const sortSliceByDate = (a, b) => {
  if (a.createdAt > b.createdAt) {
    return -1;
  } else if (a.createdAt < b.createdAt) {
    return 1;
  } else {
    return 0;
  }
};

// function to format dates into something nicer
export const customDateFormat = (date) => {
  const timeOptions = {hour: 'numeric', minute: 'numeric'};
  const dateOptions = {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'};

  const timeString = date.toLocaleTimeString('en-UK', timeOptions);
  const dateString = date.toLocaleDateString('en-UK', dateOptions);

  return `${timeString} | ${dateString}`;
};

// function to ouput how long ago a date was
export const howLongAgo = (timeThen) => {
  // if you see 'murky time' in the app, something has gone wrong
  let textOut = 'murky time';
  const timeNow = new Date();

  // time difference in seconds
  const delta = (timeNow - timeThen)/1000;

  timeLevels.forEach((level) => {
    if (level.min <= delta && delta < level.max) {
      textOut = `${Math.floor(delta/level.dem)} ${level.text}`;
    }
  });

  return textOut;
};

