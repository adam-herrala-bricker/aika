const router = require('express').Router();
const {Entry} = require('../models');
const {entryPermissions, streamPermissions} = require('../util/middleware');

// GET request for all entries (will require ADMIN token)
router.get('/', async (req, res) => {
  const allEntries = await Entry.findAll({});

  res.json(allEntries);
});

// GET request for a user to view an entry would go here, but unclear if we need that,
// since entries are viewed through streams

// POST request to create new entry
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

  const newEntry = await Entry.create({
    ...req.body,
    creatorId: creatorId,
    streamId: streamId,
  });

  res.json(newEntry);
});

// DELETE request to delete an entry
router.delete('/:id', entryPermissions, async (req, res) => {
  const entryId = req.params.id;
  const permissions = req.permissions;

  if (!permissions.canDelete) return res.status(403).json({error: 'user cannot delete this entry'});

  // remove from DB
  Entry.destroy({where: {id: entryId}});

  res.status(204).end();
});

module.exports = router;
