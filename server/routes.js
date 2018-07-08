var express = require('express');
var path = require('path');

const BUILD_PATH = path.join(__dirname + '/../client/build');

function appRoutes(app) {
  // Static files to react build.
  // toDo: Server-side render the app
  app.use('/', express.static(BUILD_PATH));

  // Sign-in callback route.
  app.get('/sign-in', signIn);
}

function signIn(req, res) {
  res.send('sign-in route');
}

module.exports = appRoutes;
