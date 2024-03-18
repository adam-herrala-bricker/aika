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

// text readout for # of minutes in future
export const howLongUntil = (minutesInFuture) => {
  let textOut = 'murky time';

  // time difference in seconds
  const delta = minutesInFuture * 60;

  timeLevels.forEach((level) => {
    if (level.min <= delta && delta < level.max) {
      textOut = `${Math.floor(delta/level.dem)} ${level.text}`;
    }
  });

  return textOut.replace('ago', '');
};

// helper for telling you how long ago some target event was (in minutes)
export const howLongAgoInMinutes = (targetEvent) => {
  const minuteFactor = 60000; // number to divide ms by to get minutes
  const timeNow = new Date();
  const timeThen = new Date(targetEvent);

  return (timeNow-timeThen)/minuteFactor;
};

// takes an object url and returns the blob
export const urlToBlob = async (objectUrl) => {
  if (!objectUrl) return null;

  const objectResponse = await fetch(objectUrl);
  const reBlobed = await objectResponse.blob();

  // can now remove object url
  URL.revokeObjectURL(objectUrl);

  return reBlobed;
};

// truncates text over N characters by adding ... in middle

