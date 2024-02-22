// these are all functions to schedule things at regular intervals
const {CronJob} = require('cron');
const {readdir, stat, unlink} = require('node:fs/promises');
const {ActiveConfirmation, ActiveSession, User} = require('../models');
const {howLongAgoInMinutes} = require('./helpers');

// function used to prune ActiveConfirmations + Users after 30 minutes
// after is the time after which to prune (in minutes)
const pruneConfirmations = async (after = 30) => {
  const activeConfirmations = await ActiveConfirmation.findAll();

  // loop over every active confirmation to see how old it is
  let pruneCount = 0;
  for await (const entry of activeConfirmations) {
    const thisId = entry.userId;

    // prune if older than maxTime (in minutes)
    if (howLongAgoInMinutes(entry.createdAt) > after) {
      console.log(`pruning active confirmation for user: ${thisId}`);
      await ActiveConfirmation.destroy({where: {userId: thisId}});
      await User.destroy({where: {id: thisId}});
      pruneCount ++;
    }
  }
  return pruneCount;
};

// function used fo prune ActiveSessions older than 1 week (10080 minutes)
// note: this doesn't do anything to the User
const pruneSessions = async (after = 10080) => {
  const activeSessions = await ActiveSession.findAll();

  let pruneCount = 0;
  for await (const entry of activeSessions) {
    const thisId = entry.userId;
    if (howLongAgoInMinutes(entry.createdAt) > after) {
      console.log(`pruning active session for user: ${thisId}`);
      await ActiveSession.destroy({where: {id: entry.id}});
      pruneCount ++;
    }
  }
  return pruneCount;
};

// function used to prune temp media after 5 minutes
// (don't need to keep this on server)
const pruneMedia = async (after = 5) => {
  const mediaPath = './temp/downloads';
  const mediaFiles = await readdir(mediaPath);

  let pruneCount = 0;
  for await (const file of mediaFiles) {
    const fileStats = await stat(`${mediaPath}/${file}`);

    if (howLongAgoInMinutes(fileStats.birthtime) > after) {
      await unlink(`${mediaPath}/${file}`);
      console.log(`temp media pruned: ${file}`);
      pruneCount ++;
    }
  }

  return pruneCount;
};

// scheduler for prune functions
const prune = new CronJob(
  '0 */5 * * * *', // fire every five minutes on the minute
  async () => { // callback function to do the pruning
    console.log(new Date());
    console.log('beginning prune check');

    const confirmationsPruned = await pruneConfirmations();
    const sessionsPruned = await pruneSessions();
    const mediaPruned = await pruneMedia();

    if (confirmationsPruned + sessionsPruned + mediaPruned === 0) {
      console.log('nothing pruned');
    }
  }
);

module.exports = {prune};