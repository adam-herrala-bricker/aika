const nodemailer = require('nodemailer');
const {auth, confText} = require('./config');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth
});

const sendConfirmationEmail = (addressTo, confLink='no link provided') => {
  transporter.sendMail({
    from: 'nasty.toboggan@gmail.com',
    to: addressTo,
    subject: 'Aika - Email Confirmation',
    text: `${confText} ${confLink}`
  });
};

module.exports = {sendConfirmationEmail};