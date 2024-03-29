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

User.hasMany(StreamUser, {foreignKey: 'userId'});
StreamUser.belongsTo(User, {foreignKey: 'userId'});

Slice.belongsTo(User, {foreignKey: 'creatorId'});
User.hasMany(Slice, {foreignKey: 'creatorId'});

Slice.belongsTo(Stream);
Stream.hasMany(Slice);

Slice.belongsTo(Strand);
Strand.hasMany(Slice);

Strand.belongsTo(User, {foreignKey: 'creatorId'});
User.hasMany(Strand, {foreignKey: 'creatorId'});

Strand.belongsTo(Stream, {foreignKey: 'streamId'});
Stream.hasMany(Strand, {foreignKey: 'streamId'});

module.exports = {
  ActiveConfirmation,
  ActiveSession,
  Slice,
  Strand,
  Stream,
  StreamUser,
  User
};
