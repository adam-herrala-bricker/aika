const nodemailer = require('nodemailer');
const {auth, confText} = require('./config');

const baseLink = 'http://localhost:3001/email-confirmation';

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