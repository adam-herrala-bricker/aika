// these are all functions to schedule things at regular intervals
const {CronJob} = require('cron');
const {ActiveConfirmation, User} = require('../models');
const {howLongAgoInMinutes} = require('./helpers');

// function used to prune ActiveConfirmations + Users after 30 minutes
// after is the time after which to prune (in minutes)
const pruneConfirmations = async (after = 30) => {
  const activeConfirmations = await ActiveConfirmation.findAll();

  // loop over every active confirmation to see how old it is
  let pruneCount = 0;
  activeConfirmations.forEach(async (entry) => {
    const thisId = entry.userId;

    // prune if older than maxTime (in minutes)
    if (howLongAgoInMinutes(entry.createdAt) > after) {
      console.log(`pruning active confirmation for user: ${thisId}`);
      await ActiveConfirmation.destroy({where: {userId: thisId}});
      await User.destroy({where: {id: thisId}});
      pruneCount ++;
    }
  });

  return pruneCount;
};

// scheduler for prune functions
const prune = new CronJob(
  '0 */5 * * * *', // fire every five minutes on the minute
  async () => { // callback function to do the pruning
    console.log(new Date());
    console.log('beginning prune check');

    const pruneCount = await pruneConfirmations(30);
    if (pruneCount === 0) console.log('nothing pruned');
  }
);

module.exports = {prune};