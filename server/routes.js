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
  app.get('/my-top', myTopTracksAndArtists);
  app.get('/recommendations', getRecommendations);
  app.get('/recommendations/genres', getGenreSeeds);
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
          res.redirect(url);
        },
        err => handleRouteError(res, err)
      );
    },
    err => handleRouteError(res, err)
  );
}

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
      debug('Get User Info error:', err);
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
        fetcher().then(data => {
          res.send(data);
        });
        // .catch(err => handleRouteError(res, err));
      },
      err => handleRouteError(res, err)
    );
  });
}

function getRecommendations(req, res) {
  const userId = req.headers['spotify-user'];
  const seed_artists =
    req.query['artists'] && req.query['artists'].length > 0
      ? req.query['artists'].split(',')
      : null;
  const seed_tracks =
    req.query['tracks'] && req.query['tracks'].length > 0
      ? req.query['tracks'].split(',')
      : null;
  const seed_genres =
    req.query['genres'] && req.query['genres'].length > 0
      ? req.query['genres'].split(',')
      : null;
  const settings = JSON.parse(req.query['settings'] || {});
  debug(settings);
  User.get(userId).then(
    user => {
      if (!user) {
        const err = new Error('User not found');
        return handleRouteError(res, err);
      }
      user
        .getRecommendations({
          seed_artists,
          seed_tracks,
          seed_genres,
          ...settings
        })
        .then(data => {
          res.send(data);
        })
        .catch(err => handleRouteError(res, err));
    },
    err => handleRouteError(res, err)
  );
}

function getGenreSeeds(req, res) {
  const userId = req.headers['spotify-user'];
  User.get(userId).then(
    user => {
      if (!user) {
        reject('Fatal error getting top: User not found');
      }
      user
        .getGenreSeeds()
        .then(data => {
          res.send(data);
        })
        .catch(err => handleRouteError(res, err));
    },
    err => handleRouteError(res, err)
  );
}

function handleRouteError(res, err) {
  res.status(err.statusCode || 500).send(err.name + ' * ' + err.message);
}

module.exports = appRoutes;
