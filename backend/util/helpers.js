// helper for telling you how long ago some target event was (in minutes)
const howLongAgoInMinutes = (targetEvent) => {
  const minuteFactor = 60000; // number to divide ms by to get minutes
  const timeNow = new Date();

  return (timeNow-targetEvent)/minuteFactor;
};

module.exports = {howLongAgoInMinutes};
