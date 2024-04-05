// everything here requires a user token
const router = require('express').Router();
const {streamPermissions} = require('../util/middleware');

const {Strand} = require('../models');

// get all strands (used when creating a new slice to see existing ones --> requires write permissions)
router.get('/:id', streamPermissions, async (req, res) => {
  const thisStreamId = req.params.id;

  // thow an error if no token provided
  if (!req.decodedToken) return res.status(401).json({error: 'token missing'});

  // throw an error if no write permissions
  if (!req.permissions.write) {
    return res.status(403).json({error: 'user cannot write to this stream'});
  }

  // get the strand names
  const strandNames = await Strand.findAll({
    where: {streamId: thisStreamId},
    attributes: ['name']
  });

  res.json(strandNames);

});

module.exports = router;
