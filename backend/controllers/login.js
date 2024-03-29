const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const {Op} = require('sequelize');
const {ActiveSession, User} = require('../models');
const {USER_SECRET} = require('../util/config');

// POST request to login (returns bearer token)
router.post('/', async (req, res) => {
  const {credentials, password} = req.body;

  // both username and email are unique, so there's no risk of this finding the wrong user
  const thisUser = await User.findOne({
    where: {
      [Op.or]:
      {
        username: credentials,
        email: credentials
      }
    }
  });

  // check the password against the hash
  const passwordCorrect = thisUser === null
    ? false // so bcrypt doesn't try to compare null.password
    : await bcrypt.compare(password, thisUser.passwordHash);

  if (!passwordCorrect) {
    return res.status(404).json({error: 'username or password incorrect'});
  }

  // can't log in if user is disabled
  if (thisUser.isDisabled) return res.status(403).json({error: 'user disabled'});

  // can't log in if user email isn't confirmed
  if (!thisUser.emailConfirmed) return res.status(403).json({error: 'user email not confirmed'});

  // data to encode in the token
  const userObject = {
    id: thisUser.id,
    username: thisUser.username
  };

  // sign new token
  const token = jwt.sign(userObject, USER_SECRET);

  // add user id + token to active sessions
  const thisSession = await ActiveSession.create({userId: thisUser.id, token: token});

  // then send respond
  res.status(200).send({
    ...userObject,
    tokenCreatedAt: thisSession.createdAt,
    token});
});

// DELETE request to logout (token is passed in header)
router.delete('/', async (req, res) => {

  // check whether a token was provided
  if (!req.encodedToken) {
    return res.status(404).end();
  }

  // delete the token (if there)
  await ActiveSession.destroy({where: {token: req.encodedToken}});

  res.status(204).end();
});

module.exports = router;
