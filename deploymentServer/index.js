const app = require('./app');
const {PORT} = require('./util/config');

const start = async () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
