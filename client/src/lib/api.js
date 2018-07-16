import { SERVER_URI } from '../env';
import axios from 'axios';

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

export function getRecommendations(userId, { artists, tracks, genres }) {
  return axios.get(SERVER_URI + '/recommendations', {
    headers: {
      'Spotify-User': userId
    },
    params: {
      artists: artists.join(','),
      tracks: tracks.join(','),
      genres: genres.join(',')
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
