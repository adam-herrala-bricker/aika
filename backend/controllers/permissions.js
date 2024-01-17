const router = require('express').Router();
const {Op} = require('sequelize');
const {StreamUser} = require('../models');
const {streamPermissions} = require('../util/middleware');

// PUT request to add/update user permissions from user side (requires USER token)
// requires userId in body, but only need to provide the permissions you want to change
router.put('/:id', streamPermissions, async (req, res) => {
  const streamId = req.params.id;
  const permissions = req.permissions;
  const body = req.body;

  if (!permissions.admin) return res.status(403).json({error: 'admin permissions required'});

  // check to see if a record is already there for this user/stream
  const existingPermissions = await StreamUser.findOne({
    where: {
      [Op.and]: {
        userId: req.body.userId,
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
