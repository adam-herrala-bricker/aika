const crypto = require('node:crypto');
const {readFile} = require('node:fs/promises');

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

// reads in file data when creating a new slice
const readFileData = async (filePath) => {
  if (!filePath) return null;

  const imageData = await readFile(`./${filePath}`, (error) => {
    if (error) {
      // error handling goes here
      console.log(error);
    }
  });

  return imageData;
};

// adds extension to file if missing (currently supports .jpg and .png)
// plus transforms 'blob' name into date/time
const extensionBlobHelper = (file) => {
  const getExtension = (fileName) => fileName.split('.').slice(-1)[0];

  // change 'blob' name into something more user-friendly
  if (file.originalname === 'blob') {
    const now = new Date();

    file.originalname =`${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}-${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
  }


  if ((file.mimetype === 'image/jpeg') && (getExtension(file.originalname) !== 'jpg')) {
    return file.originalname + '.jpg';
  } else if ((file.mimetype === 'image/png') && (getExtension(file.originalname) !== 'png')) {
    return file.originalname + '.png';
  }

  // fallback --> just return orignal file name
  return file.originalname;
};

module.exports = {extensionBlobHelper, getCryptoKey, howLongAgoInMinutes, readFileData};
