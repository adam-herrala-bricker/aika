const app = require('./app');
const {connectToDB} = require('./util/db');
const {prune} = require('./util/schedulers');
const {PORT} = require('./util/config');


const start = async () => {
  await connectToDB();
  // listen on PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    prune.start(); // used to prune old confirmations
  });
};

start();
