const crypto = require('node:crypto');

// helper to get a cryptographic key (used for email confirmation)
const getCryptoKey = (length = 256) => {
  const newKey = crypto.generateKeySync('hmac', {length});
  return newKey.export().toString('hex');
};

// helper for telling you how long ago some target event was (in minutes)
const howLongAgoInMinutes = (targetEvent) => {
  const minuteFactor = 60000; // number to divide ms by to get minutes
  const timeNow = new Date();

  return (timeNow-targetEvent)/minuteFactor;
};

module.exports = {getCryptoKey, howLongAgoInMinutes};
