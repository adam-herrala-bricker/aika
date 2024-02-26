const {
  NT_EMAIL_PASSWORD
} = require('../util/config');

const auth = {
  user: 'info@nastytoboggan.com',
  pass: NT_EMAIL_PASSWORD
};

const confText = 'Thank you for registering with Aika! Your account will be activated once your email is confirmed. This is a unique link and will expire in 30 minutes. ';

module.exports = {auth, confText};