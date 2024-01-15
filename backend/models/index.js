const ActiveSession = require('./activeSession');
const Entry = require('./entry');
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

// watch out here this might not actually be the right association
Stream.hasMany(StreamUser, {foreignKey: 'streamId'});
StreamUser.belongsTo(Stream, {foreignKey: 'streamId'});

Entry.belongsTo(User, {foreignKey: 'creatorId'});
User.hasMany(Entry, {foreignKey: 'creatorId'});

Entry.belongsTo(Stream);
Stream.hasMany(Entry);

module.exports = {ActiveSession, Entry, Stream, StreamUser, User};
