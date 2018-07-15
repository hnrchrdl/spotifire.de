import React, { Component } from 'react';
import './Dashboard.css';
import * as api from '../lib/api';
import { withRouter } from 'react-router-dom';
import PlaylistForm from './PlaylistForm';
import { UserContext } from '../contexts';

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      user: null
    };
  }

  componentDidMount() {
    const { userId } = this.props.match.params;
    if (userId) {
      api
        .getUserInfo(userId)
        .then(result => {
          this.setState({ user: result.data });
        })
        .catch(err => {
          const { history } = this.props;
          history.push('/');
        });
    }
  }

  render() {
    const { user } = this.state;
    return (
      <React.Fragment>
        <UserContext.Provider value={user}>
          <PlaylistForm />
        </UserContext.Provider>
      </React.Fragment>
    );
  }
}

export default withRouter(Dashboard);
