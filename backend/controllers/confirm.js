const router = require('express').Router();
const {ActiveConfirmation, User} = require('../models');
const {howLongAgoInMinutes} = require('../util/helpers');

// POST request to confirm user creation
// (link sent to email)
router.post('/:key', async (req, res) => {
  const maxLatency = 30; // deadline (in min) to confirm email
  const thisKey = req.params.key;
  const thisSession = await ActiveConfirmation.findOne({
    where: {
      key: thisKey
    }
  });

  // response for bad key
  if (!thisSession) return res.status(404).json({error: 'confirmation key not found'});

  // get the user for that key
  const thisUser = await User.findByPk(thisSession.userId);

  // user not found
  if (!thisUser) return res.status(404).json({error: 'user not found'});

  // check how long ago the entry was added
  const latency = howLongAgoInMinutes(thisUser.createdAt);
  if (latency > maxLatency) {
    // remove from DB if they took too long
    await thisSession.destroy();
    await thisUser.destroy();
    return res.status(400).json({error: 'link has expired'});
  }

  // destroy the entry for the link either way
  await thisSession.destroy();

  // change email to confirmed
  thisUser.emailConfirmed = true;
  await thisUser.save();

  res.status(200).end();
});

module.exports = router;
