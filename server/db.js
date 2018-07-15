const Db = require('tingodb')().Db;

const db = new Db('./data/db', {});

const COLLECTIONS = {
  user: 'user'
};

function persistUser(user) {
  // Fetch a collection to insert document into
  const collection = db.collection(COLLECTIONS.user);

  return new Promise((resolve, reject) => {
    getUser(user.id).then(
      dbUser => {
        if (!dbUser) {
          collection.insert(user, function(err, result) {
            if (err) {
              debug(err);
              return reject(err);
            }
            return resolve(result);
          });
        } else {
          collection.update({ id: user.id }, user, function(err, result) {
            if (err) {
              debug(err);
              return reject(err);
            }
            return resolve(result);
          });
        }
      },
      function(err) {
        debug(err);
        reject(err);
      }
    );
  });
}

function getUser(userId) {
  return new Promise((resolve, reject) => {
    db.collection(COLLECTIONS.user).findOne({ id: userId }, function(
      err,
      result
    ) {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

// function getUserPlaylists(userId) {
//   return new Promise((resolve, reject) => {
//     db.collection(COLLECTIONS.playlist)
//       .find({ userId })
//       .toArray(function(err, result) {
//         if (err) {
//           reject(err);
//         }
//         resolve(result);
//       });
//   });
// }

// function savePlaylist(playlist) {
//   return new Promise((resolve, reject) => {
//     db.collection(COLLECTIONS.playlist).insert(playlist, function(err, result) {
//       if (err) {
//         debug(err);
//         reject(err);
//       }
//       resolve(result);
//     });
//   });
// }

// function getPlaylist(playlistId) {
//   return new Promise((resolve, reject) => {
//     db.collection(COLLECTIONS.playlist).findOne({ _id: playlistId }, function(
//       err,
//       result
//     ) {
//       if (err) {
//         debug(err);
//         reject(err);
//       }
//       resolve(result);
//     });
//   });
// }

module.exports = {
  persistUser,
  getUser
};
