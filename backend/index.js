const app = require('./app');
const {connectToDB} = require('./util/db');
const {PORT} = require('./util/config');


const start = async () => {
  await connectToDB();
  // listen on PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
