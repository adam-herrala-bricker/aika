const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');

const userRouter = require('./controllers/users');

const {connectToDB} = require('./util/db');
const {PORT} = require('./util/config');

app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);

const start = async () => {
  await connectToDB();
  // listen on PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
