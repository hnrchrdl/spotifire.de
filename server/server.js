require('dotenv').config();
const path = require('path');
global.debug = process.env.DEBUG ? require('debug')('debug') : () => {};

const name = 'better-playlist';
debug('booting %s', name);

const express = require('express');
const app = express();

// Register Middleware
if (process.env.ENABLE_CORS === '1') {
  app.use(require('cors')());
}
app.use(require('body-parser').json());

app.use(function(req, res, next) {
  debug(req.url);
  next();
});

// Statics

// Register routes.
app.get('/', function(req, res) {
  res.sendFile(REACT_STATIC + '/index.html');
});
require('./routes')(app);

// REACT
const REACT_PUBLIC = 'static_react';
const REACT_STATIC = process.cwd() + '/' + REACT_PUBLIC;
app.use('/', express.static(REACT_STATIC));
app.get('*', function(req, res) {
  res.sendFile(REACT_STATIC + '/index.html');
});

var DEFAULT_PORT = 5000;
app.listen(process.env.PORT || DEFAULT_PORT, () => {
  debug(`Server up and running on port ${DEFAULT_PORT}.`);
});
