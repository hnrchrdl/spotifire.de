const db = require('./db');
const spotify = require('./spotify');

const User = function() {
  this._id = null;
  this._displayName = null;
  this._spotifyAccessToken = null;
  this._spotifyRefreshToken = null;
  this._spotifyAccessTokenExpireDateTime = null;
  this._spotifyConnection = null;
};
User.get = function(id) {
  return db.getUser(id).then(data => {
    if (data) {
      const user = new User();
      user.fromDTO(data);
      return user;
    } else {
      return null;
    }
  });
};
User.prototype.setId = function(id) {
  this._id = id;
  return this;
};
User.prototype.getId = function(id) {
  return this._id;
};
User.prototype.setDisplayName = function(name) {
  this._displayName = name;
  return this;
};
User.prototype.getDisplayName = function(name) {
  return this._displayName;
};
User.prototype.getInfo = function() {
  return {
    id: this.getId(),
    displayName: this.getDisplayName()
  };
};
User.prototype.setId = function(id) {
  this._id = id;
  return this;
};
User.prototype.toDTO = function() {
  return {
    id: this.getId(),
    spotifyAccessToken: this.getSpotifyAccessToken(),
    spotifyRefreshToken: this.getSpotifyRefreshToken(),
    spotifyTokenExpire: this.getSpotifyAccessTokenExpireDateTime().toString()
  };
};
User.prototype.fromDTO = function(dto) {
  if (!dto) {
    throw new Error('Fatal error when converting dto to user');
  }
  this.setId(dto.id);
  this.setSpotifyAccessToken(dto.spotifyAccessToken);
  this.setSpotifyRefreshToken(dto.spotifyRefreshToken);
  this.setSpotifyAccessTokenExpireDateTime(dto.spotifyTokenExpire);
  return this;
};
User.prototype.setSpotifyAccessToken = function(token) {
  this._spotifyAccessToken = token;
  return this;
};
User.prototype.getSpotifyAccessToken = function() {
  return this._spotifyAccessToken;
};
User.prototype.setSpotifyRefreshToken = function(token) {
  this._spotifyRefreshToken = token;
  return this;
};
User.prototype.getSpotifyRefreshToken = function() {
  return this._spotifyRefreshToken;
};
User.prototype.setSpotifyAccessTokenExpireDateTime = function(expires) {
  if (expires instanceof Date) {
    this._spotifyAccessTokenExpireDateTime = expires;
  } else {
    this._spotifyAccessTokenExpireDateTime = new Date(Date.parse(expires));
  }
  return this;
};
User.prototype.getSpotifyAccessTokenExpireDateTime = function(expires) {
  return new Date(Date.parse(this._spotifyAccessTokenExpireDateTime));
};
User.prototype.isSpotifyAccessTokenExpired = function() {
  if (!this._spotifyAccessTokenExpireDateTime) {
    return true;
  }
  return new Date() > this.getSpotifyAccessTokenExpireDateTime();
};
User.prototype.setSpotifyConnection = function(connection) {
  this._spotifyConnection = connection;
  return this;
};
User.prototype.getSpotifyConnection = function() {
  return this._spotifyConnection;
};
User.prototype.authorizeSpotifyConnection = function(code = null) {
  const connection = this.getSpotifyConnection() || spotify.defaultConnection();
  const accessToken = this.getSpotifyAccessToken();
  const isExpired = this.isSpotifyAccessTokenExpired();
  this.setSpotifyConnection(connection);

  return new Promise((resolve, reject) => {
    if (accessToken && !isExpired) {
      // Use existing access token.
      this.useSpotifyAccessToken(accessToken);
      return resolve(this);
    }
    if (accessToken && isExpired) {
      // Refresh token!
      connection.setAccessToken(accessToken);
      return connection.refreshAccessToken().then(
        ({ body }) => {
          const refreshedAccessToken = body['access_token'];
          // set token and refresh token
          debug('Refreshed access token. ');
          this.useSpotifyAccessToken(refreshedAccessToken);
          return resolve(this);
        },
        err => {
          reject(err);
        }
      );
    }
    if (code) {
      // Authorize from code
      return this.getSpotifyConnection()
        .authorizationCodeGrant(code)
        .then(({ body }) => {
          const accessToken = body['access_token'];
          const refreshToken = body['refresh_token'];
          const expiresIn = body['expires_in'];
          const expireDateTime = new Date(
            new Date().getTime() + 1000 * expiresIn
          );
          this.useSpotifyAccessToken(accessToken).setSpotifyRefreshToken(
            refreshToken
          );
          this.setSpotifyAccessTokenExpireDateTime(expireDateTime);
          return resolve(this);
        })
        .catch(err => {
          debug(err);
          reject(err);
        });
    }
    throw new Error('Fatal error authorizing connection.');
  });
};
User.prototype.useSpotifyAccessToken = function(token) {
  this.setSpotifyAccessToken(token);
  const connection = this.getSpotifyConnection();
  if (connection) {
    connection.setAccessToken(token);
    return this;
  } else {
    throw new Error(
      'Fatal error: Could not set access token: No connection found.'
    );
  }
  return this;
};
User.prototype.persist = function() {
  try {
    return db.persistUser(this.toDTO()).then(() => this);
  } catch (e) {
    debug(e);
    throw e;
  }
};
User.prototype.getSpotifyProfile = function() {
  return this.authorizeSpotifyConnection()
    .then(() => {
      return this.getSpotifyConnection().getMe();
    })
    .catch(err => {
      debug(err);
    });
};
User.prototype.getTopArtists = function(limit, offset, time_range) {
  return this._spotifyConnection.getMyTopArtists({ limit, offset, time_range });
};
User.prototype.getTopTracks = function(limit, offset, time_range) {
  return this._spotifyConnection.getMyTopTracks({ limit, offset, time_range });
};
User.prototype.getTopGenres = function(limit, offset, time_range) {
  return this._spotifyConnection.getMyTopTracks({ limit, offset, time_range });
};
User.prototype.getRecommendations = function(options) {
  console.log(options);
  return this.authorizeSpotifyConnection().then(() => {
    return this.getSpotifyConnection().getRecommendations(options);
  });
};
User.prototype.getGenreSeeds = function() {
  return this.authorizeSpotifyConnection().then(() => {
    return this.getSpotifyConnection().getAvailableGenreSeeds();
  });
};

module.exports = User;
