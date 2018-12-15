import React from 'react';
import './Home.css';

export default () => {
  return (
    <div className="container">
      <div className="logo">SPOTIFIRE</div>
      <p className="slogan">Better playlists for Spotify.</p>
      <p>
        <a className="login" href={process.env.REACT_APP_SERVER_URI + '/login'}>
          Login with Spotify
        </a>
      </p>
    </div>
  );
};
