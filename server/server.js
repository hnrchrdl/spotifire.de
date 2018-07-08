const express = require('express');
const app = express();

// Register routes.
require('./routes')(app);

var DEFAULT_PORT = 3001;
function start() {
  app.listen(process.env.PORT || DEFAULT_PORT, () =>
    console.log(`Server up and running on port ${DEFAULT_PORT}.`)
  );
}

module.exports = {
  start
};
