const router = require('express').Router();
const bcrypt = require('bcrypt');
const {ActiveConfirmation, ActiveSession, Slice, Stream, StreamUser, User} = require('../models');
const {sendConfirmationEmail} = require('../emailers');
const {getCryptoKey} = require('../util/helpers');
const {NODE_ENV} = require('../util/config');

// POST request to create a new user
router.post('/', async (req, res) => {
  const {username, firstName, lastName, email, password} = req.body;
  let passwordHash;
  try {
    passwordHash = await bcrypt.hash(password, 10);
  } catch (error) {
    return res.status(400).json({error: error.message});
  }

  // create new user in DB
  const newUser = await User.create({username, firstName, lastName, email, passwordHash});

  // add confirmation key to DB
  const thisConf = await ActiveConfirmation.create({userId: newUser.id, key: getCryptoKey()});

  // send confirmation email (if not testing)
  if (NODE_ENV !== 'testing') {
    try {
      await sendConfirmationEmail(newUser.email, thisConf.key);
    } catch (error) {
      console.log('error in sending email');
      console.log(error);

      // remove entries from DB if error sending email
      await ActiveConfirmation.destroy({where: {id: thisConf.id}});
      await User.destroy({where: {id: newUser.id}});

      return res.status(400).json({error: 'error sending confirmation email'});
    }
  }

  res.json({
    id: newUser.id,
    username: newUser.username,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
  });
});

// PUT request to change user password (requires USER token + old password)
router.put('/change-password', async (req, res) => {
  // thow an error if no token provided
  if (!req.decodedToken) {
    return res.status(401).json({error: 'token missing'});
  }

  const thisID = req.decodedToken.id;
  const {oldPassword, newPassword} = req.body;

  // need both old and new password
  if (!oldPassword || !newPassword) return res.status(400).json({error: 'old and new passwords required'});

  // check for user with that ID
  const thisUser = await User.findByPk(thisID);
  if (!thisUser) return res.status(404).json({error: 'user not found'});

  // verify that the provided password is correct
  // check provided password against password hash in DB
  const passwordCorrect = thisUser === null
    ? false
    : await bcrypt.compare(oldPassword, thisUser.passwordHash);

  if (!passwordCorrect) {
    return res.status(404).json({error: 'password incorrect'});
  }

  // create new password hash
  let newPasswordHash;
  try {
    newPasswordHash = await bcrypt.hash(newPassword, 10);
  } catch (error) {
    return res.status(400).json({error: error.message});
  }

  // save new passwordHash in DB
  thisUser.passwordHash = newPasswordHash;
  await thisUser.save();

  res.status(200).end();

});

// DELETE request to remove a user identified in token (requires USER token + user's password)
// note: this route only allows users to delete themselves
// a seperate route will be needed for admin deletion of users
router.delete('/', async (req, res) => {
  // thow an error if no token provided
  if (!req.decodedToken) {
    return res.status(401).json({error: 'token missing'});
  }

  const thisID = req.decodedToken.id;
  const providedPW = req.body.password;

  // no password included with request
  if (!providedPW) return res.status(400).json({error: 'password required'});

  const thisUser = await User.findByPk(thisID);

  // no user with that ID
  if (!thisUser) return res.status(404).json({error: 'user not found'});

  // check provided password against password hash in DB
  const passwordCorrect = thisUser === null
    ? false
    : await bcrypt.compare(providedPW, thisUser.passwordHash);

  if (!passwordCorrect) {
    return res.status(404).json({error: 'password incorrect'});
  }

  // remove everything associated with that user
  await ActiveConfirmation.destroy({where: {userId: thisID}});
  await ActiveSession.destroy({where: {userId: thisID}});
  await StreamUser.destroy({where: {userId: thisID}});
  await Slice.destroy({where: {creatorId: thisID}});
  await Stream.destroy({where: {creatorId: thisID}});

  // then remove the user entry
  await User.destroy({where: {id: thisID}});
  return res.status(204).end();
});

module.exports = router;
