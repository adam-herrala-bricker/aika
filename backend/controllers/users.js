const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

// GET request for users
router.get('/', async (req, res) => {
  const users = await User.findAll({});

  res.json(users);
});

// POST request for new user
router.post('/', async (req, res) => {
  const {username, firstName, lastName, email, password} = req.body;
  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await User.create({username, firstName, lastName, email, passwordHash});
  res.json(newUser);
});

// DELETE request to remove a user by id
router.delete('/:id', async (req, res) => {
  const thisID = req.params.id;
  const thisUser = await User.findByPk(thisID);
  
  // no user with that ID
  if (!thisUser) return res.status(404).json({error: 'user not found'});
  
  await User.destroy({where: {id: thisID}})
  return res.status(204).end();
});

module.exports = router;
