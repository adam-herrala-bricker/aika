const router = require('express').Router();
const {Op} = require('sequelize');
const {Entry, Slice, Stream, StreamUser, User} = require('../models');
const {streamPermissions} = require('../util/middleware');

// GET request to view user's own streams (requires USER token)
router.get('/mine', async (req, res) => {
  const streams = await Stream.findAll({
    include: {
      model: Entry,
      attributes: {
        exclude: ['updatedAt', 'creatorId', 'streamId']
      }
    },
    where: {creatorId: req.decodedToken.id}});

  res.json(streams);
});

// GET request to view all streams user has read permission for (requires USER token)
// if id is provided, it only returns the one
router.get('/read', async (req, res) => {
  const queryParams = {
    attributes: {exclude: ['userId', 'streamId']},
    include: {
      model: Stream
    }};

  // thow an error if no token provided
  if (!req.decodedToken) return res.status(401).json({error: 'token missing'});

  const streams = await StreamUser.findAll({
    ...queryParams,
    where: {
      [Op.and]: {
        read: true,
        userId: req.decodedToken.id
      }
    }});

  res.json(streams);
});

// returns user's permissions for just the provided stream (if any)
// used for settings in frontend (requires USER token)
router.get('/my-permissions/:id', async (req, res) => {
  const thisStreamId = req.params.id;

  // thow an error if no token provided
  if (!req.decodedToken) return res.status(401).json({error: 'token missing'});

  const thisStream = await StreamUser.findOne({
    where: {
      [Op.and]: {
        streamId: thisStreamId,
        userId: req.decodedToken.id
      }
    }
  });

  if (!thisStream) {
    return res.status(404).end();
  }

  res.json(thisStream);
});

// returns all permisions on the provided stream
// requires admin permissions on that stream (and a USER token)
router.get('/all-permissions/:id', streamPermissions, async (req, res) => {
  const streamId = req.params.id;
  const userPermissions = req.permissions;

  if (!userPermissions.admin) return res.status(403).json({error: 'admin permissions required'});

  const foundPermissions = await StreamUser.findAll({
    where: {streamId},
    include: {
      model: User,
      attributes: ['username']
    }
  });

  res.json(foundPermissions);
});

// GET request to view all entries in a single stream (requires USER token)
router.get('/one/:id', streamPermissions, async (req, res) => {
  const streamId = req.params.id;
  const userPermissions = req.permissions;

  // user doesn't have read permissions
  if (!userPermissions.read) {
    return res.status(403).json({error: 'user does not have read permissions for this stream'});
  }

  const stream = await Stream.findByPk(streamId, {
    include: {
      model: Entry,
      attributes: {
        exclude: ['streamId', 'creatorId']
      },
      include: {
        model: User,
        attributes: ['id', 'username', 'firstName', 'lastName']
      },
    },
    order: [[Entry, 'createdAt', 'DESC']]
  });

  res.json(stream);
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
    deleteOwn: true,
    deleteAll: true,
    admin: true,
  });

  res.json(newStream);
});

// DELETE request to delete a stream (requires USER token)
router.delete('/:id', streamPermissions, async (req, res) => {
  const streamId = req.params.id;
  const userPermissions = req.permissions;

  // user doesn't have delete permissions
  if (!userPermissions.deleteAll) {
    return res.status(403).json({error: 'user cannot delete this stream'});
  }

  // remove from streams, stream_users, and slices
  // note that the order matters: the foreign keys need to be removed first
  await Slice.destroy({where: {streamId: streamId}});
  await StreamUser.destroy({where: {streamId: streamId}});
  await Stream.destroy({where: {id: streamId}});

  res.status(204).end();
});


module.exports = router;
