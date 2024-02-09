const router = require('express').Router();
const {Slice} = require('../models');
const {slicePermissions, streamPermissions} = require('../util/middleware');

// GET request for all slices (will require ADMIN token)
router.get('/', async (req, res) => {
  const allSlices = await Slice.findAll({});

  res.json(allSlices);
});

// POST request to view X slices in a stream, starting at Y (requires USER token)
router.post('/view/:id', streamPermissions, async (req, res) => {
  const defaultLimit = 10;
  const defaultOffset = 0;
  const streamId = req.params.id;
  const permissions = req.permissions;

  const thisLimit = req.body.limit || defaultLimit;
  const thisOffset = req.body.offset || defaultOffset;

  if (!permissions.read) return res.status(403).json({error: 'read permission required'});

  const entries = await Slice.findAll({
    where: {streamId: streamId},
    limit: thisLimit,
    offset: thisOffset,
    order: [['createdAt', 'DESC']]
  });

  res.json(entries);

});

// POST request to create new slice
router.post('/:id', streamPermissions, async (req, res) => {
  const creatorId = req.decodedToken.id;
  const streamId = req.params.id;
  const permissions = req.permissions;

  if (!creatorId || !streamId) {
    return res.status(400).json({error: 'user and stream id must be provided'});
  }

  if(!permissions.write) {
    return res.status(403).json({error: 'user cannot write to this stream'});
  }

  const newEntry = await Slice.create({
    ...req.body,
    creatorId: creatorId,
    streamId: streamId,
  });

  res.json(newEntry);
});

// DELETE request to delete a slice
router.delete('/:id', slicePermissions, async (req, res) => {
  const entryId = req.params.id;
  const permissions = req.permissions;

  if (!permissions.canDelete) return res.status(403).json({error: 'user cannot delete this entry'});

  // remove from DB
  await Slice.destroy({where: {id: entryId}});

  res.status(204).end();
});

module.exports = router;
