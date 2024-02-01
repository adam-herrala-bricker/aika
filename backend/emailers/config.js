const {GMAIL_ADDRESS, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN} = require('../util/config');

const auth = {
  type: 'OAuth2',
  user: GMAIL_ADDRESS,
  refreshToken: GMAIL_REFRESH_TOKEN,
  clientId: GMAIL_CLIENT_ID,
  clientSecret: GMAIL_CLIENT_SECRET
};

const confText = 'Thank you for registering with Aika! Confirm your email (valid for the next 30 minutes): ';

module.exports = {auth, confText};