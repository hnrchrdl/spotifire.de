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
app.use(express.static(process.cwd() + '/public'));

// Register routes.
// REACT
const REACT_PUBLIC = 'static_react';
app.use(express.static(process.cwd() + '/' + REACT_PUBLIC));

const REACT_STATIC = path.join(__dirname, REACT_PUBLIC, 'index.html');
app.get('/', function(req, res) {
  res.sendFile(REACT_STATIC);
});

require('./routes')(app);

var DEFAULT_PORT = 5000;
app.listen(process.env.PORT || DEFAULT_PORT, () => {
  debug(`Server up and running on port ${DEFAULT_PORT}.`);
});
