const jwt = require('jsonwebtoken');
const {Op} = require('sequelize');
const {ActiveSession, Entry, StreamUser} = require('../models');
const {USER_SECRET} = require('./config');

// extracts bearer token from the header (if provided)
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.encodedToken = authorization.substring(7);
  }

  next();
};

// takes a token (if provided) and authenticates it
const userExtractor = async (req, res, next) => {
  // only run if token was provided
  if (req.encodedToken) {
    // check that the token is in active sessions
    const thisSession = await ActiveSession.findAll({where: {token: req.encodedToken}});
    if (thisSession.length === 0) {
      throw Error('expired token');
    }
    // decode the token
    const decodedToken = jwt.verify(req.encodedToken, USER_SECRET);
    req.decodedToken = decodedToken;
  }

  next();
};

// if there's a decoded token, checks that user's stream permissions (given a STREAM id)
// note: this only runs for specific endpoints that need to know stream permissions
const streamPermissions = async (req, res, next) => {
  if (!req.decodedToken) return res.status(400).json({error: 'token missing'});
  if (!req.params.id) return res.status(400).json({error: 'stream id missing'});

  // there will only ever be one StreamUser entry for each stream/user pair
  const permissions = await StreamUser.findOne({
    where: {
      [Op.and]: {
        userId: req.decodedToken.id,
        streamId: req.params.id,
      }
    }});

  // will only ever run on endpoints where not finding permissions is an error
  if (!permissions) return res.status(404).json({error: 'no user permissions for this stream'});

  req.permissions = permissions;

  next();
};

// if there's a decoded token, checks the user's stream permissions (given an ENTRY id)
// this also only runs on specific endpoints that need to know stream permissions
// but in this case it's for operations on an entry, not an entire stream
const entryPermissions = async (req, res, next) => {
  const entryId = req.params.id;
  const user = req.decodedToken;
  if (!user) return res.status(400).json({error: 'token missing'});
  if (!entryId) return res.status(400).json({error: 'entry id missing'});

  // first need stream id for the given entry
  const thisEntry = await Entry.findByPk(entryId);
  if (!thisEntry) return res.status(404).json({error: 'entry not found'});

  // then check permissions for the stream the entry is on
  const permissions = await StreamUser.findOne({
    where: {[Op.and]: {
      userId: user.id,
      streamId: thisEntry.streamId,
    }
    }});

  // will only ever run on endpoints where not finding permissions is an error
  if (!permissions) return res.status(404).json({error: 'no user permissions for this stream'});

  // variable for whether the user can delete this post
  const canDelete = (permissions.deleteOwn && thisEntry.creatorId === user.id) || permissions.deleteAll;

  // note entry permissions are structured differently than stream permissions
  req.permissions = {
    canRead: permissions.read,
    canWrite: permissions.write,
    canDelete: canDelete
  };

  next();
};

const errorHandler = (error, request, response, next) => {

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'});
  } else if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({error: error.message});
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    return response.status(400).json({error: 'entry must be unique'});
  } else if (error.name === 'SequelizeDatabaseError') {
    return response.status(400).json({error: error.message});
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(400).json({error: error.message});
  } else if (error.message === 'expired token') {
    return response.status(403).json({error: 'login token has expired'});
  }

  next(error);
};

module.exports = {
  tokenExtractor,
  userExtractor,
  streamPermissions,
  entryPermissions,
  errorHandler,
};
