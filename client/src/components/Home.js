import React from 'react';
import './Home.css';
import { SERVER_URI } from '../env';

export default () => {
  return (
    <div className="container">
      <div className="logo">SPOTIFIRE</div>
      <p className="slogan">Better playlists for Spotify.</p>
      <p>
        <a className="login" href={SERVER_URI + '/login'}>
          Login with Spotify
        </a>
      </p>
    </div>
  );
};
