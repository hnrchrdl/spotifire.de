import './Dashboard.css';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Modal } from 'react-materialize';
import Navbar from './Navbar';
import Footer from './Footer';
import PlaylistForm from './PlaylistForm';
import PlaylistPreview from './PlaylistPreview';
import * as api from '../lib/api';
import { UserContext } from '../contexts';

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      recommendations: null
    };
    this.playlistlistPreviewId = 'PlaylistlistPreview';
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

  handlePlaylistFormSubmit = data => {
    api
      .getRecommendations(this.state.user.id, data)
      .then(({ data }) => {
        console.log(data.body.tracks);
        this.setState(
          {
            recommendations: data.body.tracks
          },
          () => {
            window.$(`#${this.playlistlistPreviewId}`).modal('open');
          }
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { user } = this.state;
    return (
      <React.Fragment>
        <UserContext.Provider value={user}>
          <Navbar />
          <PlaylistForm handleSubmit={this.handlePlaylistFormSubmit} />
          <Modal id={this.playlistlistPreviewId} header="Preview">
            {this.state.recommendations && (
              <PlaylistPreview tracks={this.state.recommendations} />
            )}
          </Modal>
          <Footer />
        </UserContext.Provider>
      </React.Fragment>
    );
  }
}

export default withRouter(Dashboard);
