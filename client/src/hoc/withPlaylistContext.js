import React from 'react';

const withPlaylistContext = Component => {
  return props => (
    <Playlist.Consumer>
      {playlist => {
        return <Component {...props} playlist={playlist} />;
      }}
    </Playlist.Consumer>
  );
};
export default withPlaylistContext;
