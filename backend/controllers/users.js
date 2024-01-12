const router = require('express').Router();
const User = require('../models/user');

// GET request for users
router.get('/', async (req, res) => {
  const users = await User.findAll({});

  res.json(users);
});

// POST request for new user
router.post('/', async (req, res) => {
  const {username, firstName, lastName, email, password} = req.body;
  const passwordHash = password;

  const newUser = await User.create({username, firstName, lastName, email, passwordHash});
  res.json(newUser);
});

module.exports = router;
