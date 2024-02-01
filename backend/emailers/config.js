const {GMAIL_ADDRESS, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN} = require('../util/config');

const auth = {
  type: 'OAuth2',
  user: GMAIL_ADDRESS,
  refreshToken: GMAIL_REFRESH_TOKEN,
  clientId: GMAIL_CLIENT_ID,
  clientSecret: GMAIL_CLIENT_SECRET
};

const confText = 'Thank you for registering with Aika! Your account will be activated once your email is confirmed. This is a unique link and will expire in 30 minutes. ';

module.exports = {auth, confText};