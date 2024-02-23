const nodemailer = require('nodemailer');
const {auth, confText} = require('./config');
const {NODE_ENV} = require('../util/config');

const baseLink = NODE_ENV === 'production'
  ? 'https://aika-1l2h.onrender.com/email-confirmation'
  : 'http://localhost:3001/email-confirmation';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth
});

const sendConfirmationEmail = (addressTo, confKey='no link provided') => {
  transporter.sendMail({
    from: 'nasty.toboggan@gmail.com',
    to: addressTo,
    subject: 'Aika - Email Confirmation',
    text: `${confText} ${baseLink}/${confKey}`
  });
};

module.exports = {sendConfirmationEmail};