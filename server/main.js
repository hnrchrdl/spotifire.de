// get access token
var server = require('./server.js');
// https://accounts.spotify.com/authorize/?client_id=2be7f1b25d6546f7835514472859ca5f&response_type=code&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&scope=playlist-modify-private%20user-read-recently-played%20user-read-currently-playing%20user-read-playback-state%20user-top-read&state=34fFs29kd09

var SpotifyWebApi = require('spotify-web-api-node');
var opn = require('opn');

var uri_base = 'https://accounts.spotify.com/authorize';
var queryParameters = {
  client_id: '2be7f1b25d6546f7835514472859ca5f',
  response_type: 'code',
  redirect_uri: 'https://example.com/callback',
  scopes: [
    'playlist-modify-private',
    'user-read-recently-played',
    'user-read-currently-playing',
    'user-read-playback-state',
    'user-top-read'
  ].join('+'),
  state: '34fFs29kd09'
};
var queryString = Object.keys(queryParameters)
  .map(function(key) {
    return [key, queryParameters[key]].join('=');
  })
  .join('&');

var url = `${uri_base}?${queryString}`;

// opens the url in the default browser
// opn(url);
server.start();

/**
 * This app refreshes an access token. Refreshing access tokens is only possible access tokens received using the
 * Authorization Code flow, documented here: https://developer.spotify.com/spotify-web-api/authorization-guide/#authorization_code_flow
 */

var authorizationCode =
  'AQAkaen01ovk6P2f7ms1fph2Cj1_CKFWIeDC6WdfH85jBB0bn3Qi0vOcmJAQImp4afhmTHb-IWA0zYaa-z_PRvNe71muCBQJNdCjdhkwLNkzakBwPI-ef0z6Wj6RPRuS4cl0mH4x1481ceIbTvNBBOGid_mY1I4SLaF_pkb-IR4LBYij7HIZ5QLU_R7WekAnc6ZQLm9P8OYHZCDOPqEzb4S6SnlG1E88SWic3yRZfn5hEi6yGaGexX-aamEErHR_iPM6krq4FKl6iCyf3vMabRuTtVTTKXiw064BJpm3RZj0q7l0N4vUmWtTfyhwyZPKgobTzqUrWZsgDssWYJVwYzyTcoPXajfwq0wXHQ';
/**
 * Set the credentials given on Spotify's My Applications page.
 * https://developer.spotify.com/my-applications
 */
var spotifyApi = new SpotifyWebApi({
  clientId: '2be7f1b25d6546f7835514472859ca5f',
  clientSecret: '9797639a803344baaab18954e9183efc',
  redirectUri: 'https://example.com/callback'
});

// When our access token will expire
var tokenExpirationEpoch;

// First retrieve an access token
spotifyApi.authorizationCodeGrant(authorizationCode).then(
  function(data) {
    // Set the access token and refresh token
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);

    console.log(data.body['access_token']);
    console.log(data.body['refresh_token']);

    // Save the amount of seconds until the access token expired
    // tokenExpirationEpoch =
    //   new Date().getTime() / 1000 + data.body['expires_in'];

    registerRefreshTokenRefresh();

    runApp();
  },
  function(err) {
    console.log(
      'Something went wrong when retrieving the access token!',
      err.message
    );
  }
);

function runApp() {
  spotifyApi.getMe().then(
    function(data) {
      var userId = data.body.id;
      const playlistName = 'Keep it going';
      setInterval(function() {
        spotifyApi
          .getUserPlaylists(userId)
          .then(function(data) {
            console.log('Retrieved playlists', data.body);
            return data.body;
          })
          .then(function(playlistData) {
            const playlist = playlistData.items.find(
              playlist => playlist.name === playlistName
            );
            if (!playlist) {
              return spotifyApi.createPlaylist(userId, playlistName, {
                public: false
              });
            } else {
              return playlist;
            }
          })
          .catch(function(err) {
            console.log('Something went badly wrong!', err);
          });
      }, 10000);
    },
    function(err) {
      console.log('Something went getting user info!', err);
    }
  );

  // First retrieve an access token
  // Get information about current playing song for signed in user
  // spotifyApi.getMyCurrentPlayingTrack({}).then(
  //   function(data) {
  //     // Output items
  //     console.log('Now Playing: ', data.body);
  //   },
  //   function(err) {
  //     console.log('Something went wrong getting current playing song!', err);
  //   }
  // );

  // First retrieve an access token
  // Get information about current playing song for signed in user
  // spotifyApi.getMyCurrentPlayingTrack({}).then(
  //   function(data) {
  //     // Output items
  //     console.log('Now Playing: ', data.body);
  //   },
  //   function(err) {
  //     console.log('Something went wrong getting current playing song!', err);
  //   }
  // );
}

function registerRefreshTokenRefresh() {
  setInterval(function() {
    spotifyApi.refreshAccessToken().then(
      function(data) {
        // set token and refresh token
        console.log('Refreshed access token. ', data.body['access_token']);
        spotifyApi.setAccessToken(data.body['access_token']);
      },
      function(err) {
        console.log('Could not refresh the token!', err.message);
      }
    );
  }, 3500000);
}
