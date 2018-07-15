require('dotenv').config();
global.debug = require('debug')('debug');
const name = 'better-playlist';
debug('booting %s', name);

const express = require('express');
const app = express();

// Register Middleware
if (process.env.ENABLE_CORS === '1') {
  app.use(require('cors')());
}
app.use(require('body-parser').json());

// Register routes.
require('./routes')(app);

var DEFAULT_PORT = 3001;
app.listen(process.env.PORT || DEFAULT_PORT, () =>
  debug(`Server up and running on port ${DEFAULT_PORT}.`)
);
