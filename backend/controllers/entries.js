const router = require('express').Router();
const {Op} = require('sequelize');
const {Entry, StreamUser} = require('../models');

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
router.delete('/:id', async (req, res) => {
  const creatorId = req.decodedToken.id;
  const entryId = req.params.id;

  // check that the entry is there
  const thisEntry = await Entry.findByPk(entryId);
  if (!thisEntry) return res.status(404).json({error: 'entry not found'});

  const userPermissions = await StreamUser.findOne({
    where: {[Op.and]: {
      userId: req.decodedToken.id,
      streamId: thisEntry.streamId,
    }
    }});

  if (!userPermissions) return res.status(403).json({error: 'no user permissions for this stream'});

  // can delete if deleteOwn AND it's the user's own, OR deleteAll
  const canDelete = (userPermissions.deleteOwn && thisEntry.creatorId === creatorId) || userPermissions.deleteAll;
  if (!canDelete) return res.status(403).json({error: 'user cannot delete this entry'});

  // remove from DB
  Entry.destroy({where: {id: entryId}});

  res.status(204).end();
});

module.exports = router;
