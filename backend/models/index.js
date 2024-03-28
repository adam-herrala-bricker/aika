const ActiveConfirmation = require('./activeConfirmation');
const ActiveSession = require('./activeSession');
const Slice = require('./slice');
const Strand = require('./strand');
const Stream = require('./stream');
const StreamUser = require('./streamUser');
const User = require('./user');

// many-to-one association between ActiveSessions and Users
// note: MUST BE INCLUDED AS A PAIR!
ActiveSession.belongsTo(User); // looks like it takes 'userId' as the foreign key by default
User.hasMany(ActiveSession);

ActiveConfirmation.belongsTo(User);
User.hasMany(ActiveConfirmation);

Stream.belongsTo(User, {foreignKey: 'creatorId'});
User.hasMany(Stream, {foreignKey: 'creatorId'});

Stream.belongsToMany(User, {through: StreamUser, as: 'connected_streams'});
User.belongsToMany(Stream, {through: StreamUser, as: 'connected_users'});

// watch out here this might not actually be the right association
Stream.hasMany(StreamUser, {foreignKey: 'streamId'});
StreamUser.belongsTo(Stream, {foreignKey: 'streamId'});

User.hasMany(StreamUser, {foreighKey: 'userId'});
StreamUser.belongsTo(User, {foreignKey: 'userId'});

Slice.belongsTo(User, {foreignKey: 'creatorId'});
User.hasMany(Slice, {foreignKey: 'creatorId'});

Slice.belongsTo(Stream);
Stream.hasMany(Slice);

Slice.belongsTo(Strand, {foreignKey: 'creatorId'});
Strand.hasMany(Slice, {foreignKey: 'creatorId'});

module.exports = {
  ActiveConfirmation,
  ActiveSession,
  Slice,
  Stream,
  StreamUser,
  User
};
