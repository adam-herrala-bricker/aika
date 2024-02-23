const router = require('express').Router();
const {Op} = require('sequelize');
const {StreamUser, User} = require('../models');
const {streamPermissions} = require('../util/middleware');

// PUT request to add/update user permissions from user side (requires USER token)
// requires userId (or username) in body, but only need to provide the permissions you want to change
router.put('/:id', streamPermissions, async (req, res) => {
  const streamId = req.params.id;
  const permissions = req.permissions;
  const body = req.body;

  if (!body.userId && !body.username) return res.status(400).json({error: 'user info missing'});
  if (!permissions.admin) return res.status(403).json({error: 'admin permissions required'});

  // verify that the requested user is in the DB (MW checks the stream)
  // (redundant if username but not userId provided in request)
  if (!body.username) {
    const isUser = await User.findByPk(body.userId);
    if (!isUser) return res.status(404).json({error: 'invalid userId'});
  }

  // get userId if not provided
  if (body.username) {
    const thisUser = await User.findOne({where: {username: body.username}});

    if (!thisUser) return res.status(404).json({error: 'invalid username'});

    body.userId = thisUser.id;
  }

  // check to see if a record is already there for this user/stream
  const existingPermissions = await StreamUser.findOne({
    where: {
      [Op.and]: {
        userId: body.userId,
        streamId: streamId,
      }
    }});

  // only change provided permissions if existing permissions
  if (existingPermissions) {
    if (body.read !== undefined) existingPermissions.read = body.read;
    if (body.write !== undefined) existingPermissions.write = body.write;
    if (body.deleteOwn !== undefined) existingPermissions.deleteOwn = body.deleteOwn;
    if (body.deleteAll !== undefined) existingPermissions.deleteAll = body.deleteAll;
    if (body.admin !== undefined) existingPermissions.admin = body.admin;

    await existingPermissions.save();

    return res.json(existingPermissions);
  }

  // otherwise there are no existing permissions
  const newPermissions = await StreamUser.create({
    ...body,
    streamId: streamId
  });

  res.json(newPermissions);
});

module.exports = router;
