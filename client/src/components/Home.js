import React from 'react';
import './Home.css';
import { SERVER_URI } from '../env';

export default () => {
  return (
    <div className="container">
      <a className="login" href={SERVER_URI + '/login'}>
        Login with Spotify
      </a>
    </div>
  );
};
