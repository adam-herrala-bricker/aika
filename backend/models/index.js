const ActiveSession = require('./activeSession');
const Stream = require('./stream');
const StreamUser = require('./streamUser');
const User = require('./user');

// many-to-one association between ActiveSessions and Users
// note: MUST BE INCLUDED AS A PAIR!
ActiveSession.belongsTo(User); // looks like it takes 'userId' as the foreign key by default
User.hasMany(ActiveSession);

Stream.belongsTo(User, {foreignKey: 'creatorId'});
User.hasMany(Stream, {foreignKey: 'creatorId'});

Stream.belongsToMany(User, {through: StreamUser, as: 'connected_streams'});
User.belongsToMany(Stream, {through: StreamUser, as: 'connected_users'});

module.exports = {ActiveSession, Stream, StreamUser, User};
