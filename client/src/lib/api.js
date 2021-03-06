import axios from 'axios';

const SERVER_URI = process.env.REACT_APP_SERVER_URI;

export function getUserInfo(userId) {
  return axios.get(SERVER_URI + '/user?userId=' + encodeURIComponent(userId));
}

export function getTop(userId, type, limit, offset, time_range) {
  return axios.get(SERVER_URI + '/my-top', {
    params: {
      userId,
      type,
      limit,
      offset,
      time_range
    }
  });
}

export function getRecommendations(
  userId,
  { artists, tracks, genres, settings }
) {
  return axios.get(SERVER_URI + '/recommendations', {
    headers: {
      'Spotify-User': userId
    },
    params: {
      artists: artists.join(','),
      tracks: tracks.join(','),
      genres: genres.join(','),
      settings
    }
  });
}

export function getGenreSeeds(userId) {
  return axios.get(SERVER_URI + '/recommendations/genres', {
    headers: {
      'Spotify-User': userId
    }
  });
}
// export function createPlaylist(userId, options) {
//   return axios
//     .post(SERVER_URI + '/create-playlist', { userId, options })
//     .then(result => result.data);
// }

// export function publishPlaylist(data) {
//   return axios.post(SERVER_URI + '/publish-playlist', {
//     userId: data.userId,
//     playlistId: data.playlistId
//   });
// }
