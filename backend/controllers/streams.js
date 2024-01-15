const router = require('express').Router();
const {Op} = require('sequelize');
const {Stream, StreamUser, User} = require('../models');

// GET request to see all streams (will require ADMIN token)
router.get('/', async (req, res) => {
  const streams = await Stream.findAll({
    attributes: {exclude: ['creatorId']},
    include: {
      model: User,
      attributes: ['id', 'username']
    }
  });

  res.json(streams);
});

// GET request to view your own streams (requires USER token)
router.get('/mine', async (req, res) => {
  const streams = await Stream.findAll({
    where: {creatorId: req.decodedToken.id}});

  res.json(streams);
});

// POST request to create new stream (requires USER token)
router.post('/', async (req, res) => {
  const {name} = req.body;
  // thow an error if no token provided
  if (!req.decodedToken) {
    return res.status(401).json({error: 'token missing'});
  }

  // automatically assigns to the logged in user
  const newStream = await Stream.create({
    name: name,
    creatorId: req.decodedToken.id,
  });

  // then add to stream_user (max permissions for creator)
  await StreamUser.create({
    streamId: newStream.id,
    userId: req.decodedToken.id,
    read: true,
    write: true,
    delete: true
  });

  res.json(newStream);
});

// DELETE request to delete a stream (requires USER token)
router.delete('/:id', async (req, res) => {
  const streamId = req.params.id;
  // there should be only one UserStream entry per user/stream
  const userPermissions = await StreamUser.findOne({
    where: {[Op.and]: {
      userId: req.decodedToken.id,
      streamId: streamId,
    }
    }});

  // entry not found
  if (!userPermissions) {
    return res.status(404).json({error: 'user, stream, or user permissions not found'});
  }

  // user doesn't have delete permissions
  if (!userPermissions.delete) {
    return res.status(403).json({error: 'user cannot delete this stream'});
  }


  // remove from both streams and stream_users join table
  // note that the order matters: the foreign key needs to be removed first
  await StreamUser.destroy({where: {streamId: streamId}});
  await Stream.destroy({where: {id: streamId}});

  res.status(204).end();
});


module.exports = router;
