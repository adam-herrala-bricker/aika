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

// static FE builds
app.use('/', express.static('../browserRoot/build'));
app.use(['/aika', '/about'], express.static('../browserRoot/build')); // need these to work with router on refresh

app.use('/email-confirmation/:id', express.static('../browserConf/build'));

app.use('/app', express.static('../browserApp/build'));
app.use('/admin', express.static('../browserAdmin/build'));

// custom middleware
app.use(middleware.tokenExtractor);
app.use(middleware.userExtractor);

// static for downloading media
app.use(
  '/media/:id/',
  middleware.streamPermissions,
  middleware.staticAuthorization,
  middleware.tempDownloads, // only run this AFTER permissions + auth have been cleared
  express.static('./temp/downloads/')
);

// routes
app.use('/confirm', confirmRouter);
app.use('/api/login', loginRouter);
app.use('/api/slices', slicesRouter);
app.use('/api/permissions', permissionsRouter);
app.use('/api/streams', streamsRouter);
app.use('/api/users', userRouter);

app.use(middleware.errorHandler);

module.exports = app;
