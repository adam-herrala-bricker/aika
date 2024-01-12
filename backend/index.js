const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

const loginRouter = require('./controllers/login');
const userRouter = require('./controllers/users');
const middleware = require('./util/middleware');

const {connectToDB} = require('./util/db');
const {PORT} = require('./util/config');

app.use(cors());
app.use(express.json());

// outputs traffic to console
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// routers
app.use('/api/login', loginRouter);
app.use('/api/users', userRouter);

app.use(middleware.errorHandler);

const start = async () => {
  await connectToDB();
  // listen on PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
