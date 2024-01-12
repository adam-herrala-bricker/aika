const ActiveSession = require('./activeSession');
const User = require('./user');

// many-to-one association between ActiveSessions and Users
// note: MUST BE INCLUDED AS A PAIR!
ActiveSession.belongsTo(User);
User.hasMany(ActiveSession);

module.exports = {ActiveSession, User};
