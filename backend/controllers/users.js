const router = require('express').Router();
const bcrypt = require('bcrypt');
const {ActiveConfirmation, ActiveSession, Slice, Stream, StreamUser, User} = require('../models');
const {getCryptoKey} = require('../util/helpers');

// GET request for users (can search by username in query)
router.get('/', async (req, res) => {
  const username = req.query.username;
  let where = {};

  if (username) {
    where = {username};
  }
  const users = await User.findAll({
    attributes: {exclude: ['passwordHash']},
    include: [{
      model: ActiveSession,
      attributes: ['id', 'token', 'createdAt']
    }, {
      model: Stream,
      attributes: ['id', 'name', 'createdAt', 'updatedAt']
    }],
    where
  });

  res.json(users);
});

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
  await ActiveConfirmation.create({userId: newUser.id, key: getCryptoKey()});

  res.json({
    id: newUser.id,
    username: newUser.username,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
  });
});

// DELETE request to remove a user identified in token (requires USER token)
// note: this route only allows users to delete themselves
// a seperate route will be needed for admin deletion of users
router.delete('/', async (req, res) => {
  // thow an error if no token provided
  if (!req.decodedToken) {
    return res.status(401).json({error: 'token missing'});
  }

  const thisID = req.decodedToken.id;
  const thisUser = await User.findByPk(thisID);

  // no user with that ID
  if (!thisUser) return res.status(404).json({error: 'user not found'});

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
