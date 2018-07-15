const express = require('express');
const path = require('path');
const User = require('./user');
const spotify = require('./spotify');

const BUILD_PATH = path.join(__dirname + '/../client/build');

function appRoutes(app) {
  // Sign-in callback route.
  app.get('/login', login);
  app.get('/user', getUserInfo);
  app.get('/sign-in', signIn);
  // app.post('/create-playlist', createPlaylist);
  // app.post('/publish-playlist', publishPlaylist);
  app.get('/my-top', myTopTracksAndArtists);

  // Static files to react build.
  // toDo: Server-side render the app
  // app.use('/', express.static(BUILD_PATH));
}
function login(req, res) {
  const url = spotify.createLoginUrl();
  res.redirect(url);
}
function signIn(req, res) {
  const code = req.query.code;
  const user = new User();

  user.authorizeSpotifyConnection(code).then(
    () => {
      user.getSpotifyProfile().then(
        ({ body }) => {
          user
            .setId(body.id)
            .setDisplayName(body.display_name)
            .persist();
          const url = `${process.env.CLIENT_URI}/${user.getId()}`;
          debug(url);
          res.redirect(url);
        },
        err => handleRouteError(res, err)
      );
    },
    err => handleRouteError(res, err)
  );
}
// function createPlaylist(req, res) {
//   const userId = req.body.userId;
//   const name = req.body.options.name;
//   const isPublic = req.body.options.public || false;

//   if (!userId || !name) {
//     res.statusMessage = 'UserId or Playlist name is missing.';
//     return res.status(400).end();
//   }
//   const user = Pool.getUser(userId);
//   if (!user) {
//     res.statusMessage = 'Could not get user ' + userId + '.';
//     return res.status(500).end();
//   }
//   user
//     .createPlaylist(name, { public: isPublic })
//     .then(function(data) {
//       res.send(200, data);
//     })
//     .catch(function(err) {
//       res.statusMessage = err.name + ': ' + err.message;
//       return res.status(err.statusCode).end();
//     });
// }
// function publishPlaylist(req, res) {
//   const userId = req.body.userId;
//   const playlistId = req.body.playlistId;
//   debug(req.body);
//   if (!userId || !playlistId) {
//     res.statusMessage = 'UserId or Playlist id is missing.';
//     return res.status(400).end();
//   }
//   const user = Pool.getUser(userId);
//   if (!user) {
//     res.statusMessage = 'Could not get user ' + userId + '.';
//     return res.status(500).end();
//   }
//   user.publishPlaylist(playlistId);
// }
function getUserInfo(req, res) {
  const userId = req.query.userId;
  const user = User.get(userId).then(
    user => {
      if (user) {
        res.send(user.getInfo());
      } else {
        res.status(404).end();
      }
    },
    err => {
      debug(err);
      res.status(500).send(err);
    }
  );
}

function myTopTracksAndArtists(req, res) {
  const userId = req.query.userId;
  const type = req.query.type;
  const limit = req.query.limit || 50;
  const offset = req.query.offset || 0;
  const time_range = req.query.time_range || 'long_term';
  User.get(userId).then(user => {
    if (!user) {
      reject('Fatal error getting top: User not found');
    }
    user.authorizeSpotifyConnection().then(
      user => {
        let fetcher;
        switch (type) {
          case 'artists':
            fetcher = () => user.getTopArtists(limit, offset, time_range);
            break;
          case 'tracks':
            fetcher = () => user.getTopTracks(limit, offset, time_range);
            break;
          case 'genres':
            fetcher = () => user.getTopGenres(limit, offset, time_range);
            break;
        }
        fetcher()
          .then(data => {
            res.send(data);
          })
          .catch(err => handleRouteError(res, err));
      },
      err => handleRouteError(res, err)
    );
  });
}

function handleRouteError(res, err) {
  debug(err);
  res.status(500).send(err.message);
}

module.exports = appRoutes;
