const router = require('express').Router();
const {Entry} = require('../models');
const {entryPermissions} = require('../util/middleware');

// GET request for all entries (will require ADMIN token)
router.get('/', async (req, res) => {
  const allEntries = await Entry.findAll({});

  res.json(allEntries);
});

// GET request for a user to view an entry would go here, but unclear if we need that,
// since entries are viewed through streams

// POST request to create new entry
router.post('/', async (req, res) => {
  const creatorId = req.decodedToken.id;
  const streamId = req.body.streamId;

  if (!creatorId || !streamId) {
    return res.status(400).json({error: 'user and stream id must be provided'});
  }

  const newEntry = await Entry.create({
    ...req.body,
    creatorId: creatorId,
  });

  res.json(newEntry);
});

// DELETE request to delete an entry
router.delete('/:id', entryPermissions, async (req, res) => {
  const entryId = req.params.id;
  const permissions = req.permissions;

  if (!permissions) return res.status(403).json({error: 'no user permissions for this stream'});
  if (!permissions.canDelete) return res.status(403).json({error: 'user cannot delete this entry'});

  // remove from DB
  Entry.destroy({where: {id: entryId}});

  res.status(204).end();
});

module.exports = router;
