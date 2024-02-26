const nodemailer = require('nodemailer');
const {auth, confText} = require('./config');
const {NODE_ENV} = require('../util/config');

const baseLink = NODE_ENV === 'production'
  ? 'https://nastytoboggan.com/email-confirmation'
  : 'http://localhost:3001/email-confirmation';

const sendConfirmationEmail = (addressTo, confKey='no link provided') => {
  const transporter = nodemailer.createTransport({
    host: 'mail.nastytoboggan.com',
    port: 465,
    secure: true,
    auth
  });

  return transporter.sendMail({
    from: 'Nasty Toboggan <info@nastytoboggan.com>',
    to: addressTo,
    subject: 'Aika - Email Confirmation',
    text: `${confText} ${baseLink}/${confKey}`
  });
};

module.exports = {sendConfirmationEmail};