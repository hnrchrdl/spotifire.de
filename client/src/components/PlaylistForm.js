import React from 'react';
import propTypes from 'prop-types';
import {
  Row,
  Col,
  Input,
  Icon,
  Badge,
  Collapsible,
  CollapsibleItem,
  Button
} from 'react-materialize';
import SeedPicker from './SeedPicker';

class PlaylistForm extends React.Component {
  static propTypes = {
    handleSubmit: propTypes.func
  };
  constructor() {
    super();
    this.state = {
      name: '',
      isPublic: false,
      numberOfTracks: 20,
      artists: [],
      tracks: [],
      genres: []
    };
  }

  onSeedChange = ({ type, id }) => {
    if (!type) {
      return;
    }
    this.setState(state => {
      if (this.state[type].includes(id)) {
        return {
          [type]: state[type].filter(_id => _id !== id)
        };
      } else {
        if (!this.isSeedsDisabled()) {
          return {
            [type]: [...state[type], id]
          };
        }
      }
    });
  };

  onNameChange = e => {
    const name = e.target.value;
    this.setState({ name });
  };

  onIsPublicChange = e => {
    const isPublic = e.target.value;
    this.setState({ isPublic });
  };

  onNumberOfTracksChange = e => {
    const numberOfTracks = e.target.value;
    this.setState({ numberOfTracks });
  };

  submit = () => {
    if (this.numSeedsSelected() === 0) {
      window.Materialize.toast(
        'Cannot generate playlist: no seeds supplied.',
        2500
      );
      return;
    }
    this.props.handleSubmit(this.state);
  };

  isSeedsDisabled = () => this.numSeedsSelected() >= 5;

  numSeedsSelected = () =>
    this.state.artists.length +
    this.state.tracks.length +
    this.state.genres.length;

  render() {
    const { name, isPublic, numberOfTracks } = this.state;
    return (
      <React.Fragment>
        <Row>
          <Col s={12}>
            <div className="right">
              <Button className="space-right" flat onClick={this.submit}>
                reset<Icon left>undo</Icon>
              </Button>
              <Button waves="teal" onClick={this.submit}>
                preview<Icon left>visibility</Icon>
              </Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col s={12}>
            <Input
              s={12}
              label="A name for the new playlist"
              defaultValue={name}
              onChange={this.onNameChange}
            />
          </Col>
        </Row>
        <Row>
          <Col s={12}>
            <Input
              name="isPublic"
              label="Make it public!"
              type="checkbox"
              defaultValue={isPublic}
              onChange={this.onIsPublicChange}
            />
          </Col>
        </Row>
        <Row>
          <Col s={12}>
            <Input
              s={12}
              name="numberOfTracks"
              label="How many tracks should it contain?"
              defaultValue={numberOfTracks}
              onChange={this.onNameChange}
            />
          </Col>
        </Row>
        <Row>
          <Col s={12}>
            <h5>Seeds</h5>
            <p>
              Up to 5 seed values may be provided in any combination of{' '}
              <i>artists</i>, <i>tracks</i> and <i>genres</i>.
              <Badge>{5 - this.numSeedsSelected()} seeds left.</Badge>
            </p>
            <Collapsible accordion onSelect={this.onSeedSelect}>
              {[
                { type: 'artists', name: 'Artists' },
                { type: 'tracks', name: 'Tracks' }
              ].map(seed => (
                <CollapsibleItem key={seed.type} header={seed.name}>
                  <SeedPicker
                    type={seed.type}
                    selected={this.state[seed.type]}
                    onChange={this.onSeedChange}
                    disabled={this.isSeedsDisabled()}
                  />
                </CollapsibleItem>
              ))}
              <CollapsibleItem header="Genres">
                {/* <GenrePicker></GenrePicker> */}
              </CollapsibleItem>
            </Collapsible>
          </Col>
        </Row>
        <Row>
          <Col s={12}>
            <h5>Settings</h5>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
export default PlaylistForm;
