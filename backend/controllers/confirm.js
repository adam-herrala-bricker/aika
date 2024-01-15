const router = require('express').Router();
const {User} = require('../models');
const {howLongAgoInMinutes} = require('../util/helpers');

// POST request to confirm user creation
// (link sent to email)
router.post('/:id', async (req, res) => {
  const maxLatency = 30; // deadline (in min) to confirm email
  const thisId = req.params.id;
  const thisUser = await User.findByPk(thisId);

  // response for bad id
  if (!thisUser) return res.status(404).json({error: 'user id not found'});

  // check how long ago the entry was added
  const latency = howLongAgoInMinutes(thisUser.createdAt);
  if (latency > maxLatency) {
    // remove from DB if they took too long
    await thisUser.destroy();
    return res.status(400).json({error: 'link has expired'});
  }

  // change email to confirmed
  thisUser.emailConfirmed = true;
  await thisUser.save();

  res.status(200).end();
});

module.exports = router;
