import React from 'react';
import propTypes from 'prop-types';
import { Table } from 'react-materialize';

const PlaylistPreview = ({ tracks }) => {
  console.log(tracks);
  return (
    <Table>
      <thead>
        <tr>
          <th data-field="song">Song</th>
          <th data-field="artist">Artist</th>
          <th data-field="album">Album</th>
        </tr>
      </thead>
      <tbody>
        {tracks.map(track => (
          <tr key={track.id}>
            <td>{track.name}</td>
            <td>{track.artists.map(artist => artist.name).join(',')}</td>
            <td>{track.album.name}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
PlaylistPreview.propTypes = {
  tracks: propTypes.array.isRequired
};
export default PlaylistPreview;
