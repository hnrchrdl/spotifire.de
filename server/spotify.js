var SpotifyWebApi = require('spotify-web-api-node');

var clientId = process.env.SPOTIFY_CLIENT_ID;
var clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
var redirectUri = process.env.REDIRECT_URI;

if (!clientId || !clientSecret || !redirectUri) {
  throw new Error(
    `Error reading spotify settings from env file!
        Set 'SPOTIFY_CLIENT_ID' and 'SPOTIFY_CLIENT_SECRET'
        in your node environment`
  );
}

const SCOPES = [
  'user-read-private',
  'playlist-modify-private',
  'playlist-modify-public',
  'playlist-read-private',
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-library-modify',
  'user-library-read',
  'user-read-recently-played',
  'user-top-read'
];

const STATE = 'fdsaoiewjiewoiagrewegegsewaoi';

function defaultConnection() {
  return new SpotifyWebApi({
    clientId,
    clientSecret,
    redirectUri
  });
}

function createLoginUrl() {
  return defaultConnection().createAuthorizeURL(SCOPES, STATE);
}

module.exports = {
  defaultConnection,
  createLoginUrl
};

//   function(data) {
//     var userId = data.body.id;
//     const playlistName = 'Keep it going';
//     setInterval(function() {
//       spotifyApi
//         .getUserPlaylists(userId)
//         .then(function(data) {
//           console.log('Retrieved playlists', data.body);
//           return data.body;
//         })
//         .then(function(playlistData) {
//           const playlist = playlistData.items.find(
//             playlist => playlist.name === playlistName
//           );
//           if (!playlist) {
//             return spotifyApi.createPlaylist(userId, playlistName, {
//               public: false
//             });
//           } else {
//             return playlist;
//           }
//         })
//         .catch(function(err) {
//           console.log('Something went badly wrong!', err);
//         });
//     }, 10000);
//   },
//   function(err) {
//     console.log('Something went getting user info!', err);
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
