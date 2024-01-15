const jwt = require('jsonwebtoken');
const {ActiveSession} = require('../models');
const {USER_SECRET} = require('./config');

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
  errorHandler,
};
