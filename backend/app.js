const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

const confirmRouter = require('./controllers/confirm');
const loginRouter = require('./controllers/login');
const slicesRouter = require('./controllers/slices');
const permissionsRouter = require('./controllers/permissions');
const streamsRouter = require('./controllers/streams');
const userRouter = require('./controllers/users');
const middleware = require('./util/middleware');

app.use(cors());
app.use(express.json());

// outputs traffic to console
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// custom middleware
app.use(middleware.tokenExtractor);
app.use(middleware.userExtractor);

// routes
app.use('/confirm', confirmRouter);
app.use('/api/login', loginRouter);
app.use('/api/slices', slicesRouter);
app.use('/api/permissions', permissionsRouter);
app.use('/api/streams', streamsRouter);
app.use('/api/users', userRouter);

app.use(middleware.errorHandler);

module.exports = app;
