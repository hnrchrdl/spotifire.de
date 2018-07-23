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
import GenrePicker from './GenrePicker';
import Settings from './Settings';

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
      genres: [],
      settings: {}
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

  onSettingChanged = ({ type, value }) => {
    console.log(type, value);
    this.setState(state => ({
      settings: { ...state.settings, [type]: value }
    }));
  };

  render() {
    const { name, isPublic, numberOfTracks } = this.state;
    return (
      <React.Fragment>
        <Row>
          <Col s={12}>
            <Button
              flat
              className="teal white-text right"
              waves="light"
              onClick={this.submit}
            >
              preview<Icon left>visibility</Icon>
            </Button>
            <Button className="space-right right" flat onClick={this.submit}>
              reset<Icon left>undo</Icon>
            </Button>
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
              <Badge>{5 - this.numSeedsSelected()} left</Badge>
            </p>
            <Collapsible onSelect={this.onSeedSelect}>
              {[
                { type: 'artists', name: 'Artists' },
                { type: 'tracks', name: 'Tracks' }
              ].map(seed => (
                <CollapsibleItem
                  key={seed.type}
                  header={
                    <React.Fragment>
                      <span>{seed.name}</span>
                      <span className="right">
                        <Badge>
                          {this.state[seed.type] &&
                            this.state[seed.type].length}{' '}
                          selected
                        </Badge>
                      </span>
                    </React.Fragment>
                  }
                >
                  <SeedPicker
                    type={seed.type}
                    selected={this.state[seed.type]}
                    onChange={this.onSeedChange}
                    disabled={this.isSeedsDisabled()}
                  />
                </CollapsibleItem>
              ))}
              <CollapsibleItem
                header={
                  <React.Fragment>
                    <span>Genres</span>
                    <span className="right">
                      <Badge>
                        {this.state.genres && this.state.genres.length} selected
                      </Badge>
                    </span>
                  </React.Fragment>
                }
              >
                <GenrePicker
                  selected={this.state.genres}
                  onChange={this.onSeedChange}
                  disabled={this.isSeedsDisabled()}
                />
              </CollapsibleItem>
            </Collapsible>
          </Col>
        </Row>
        <Row>
          <Col s={12}>
            <h5>Settings</h5>
            <Settings
              items={[
                {
                  type: 'acousticness',
                  name: 'Acousticness',
                  min: 0.0,
                  max: 1.0,
                  step: 0.1,
                  input: '',
                  hint:
                    'A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.'
                },
                {
                  type: 'danceability',
                  name: 'Danceability',
                  min: 0.0,
                  max: 1.0,
                  step: 0.1,
                  hint:
                    'Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable.'
                },
                {
                  type: 'duration_ms',
                  name: 'Duration',
                  min: 0,
                  max: 60000,
                  step: 1000,
                  hint: '	The duration of the track in milliseconds.'
                },
                {
                  type: 'energy',
                  name: 'Energy',
                  min: 0.0,
                  max: 1.0,
                  step: 0.1,
                  hint:
                    'Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.'
                },
                {
                  type: 'instrumentalness',
                  name: 'Instrumentalness',
                  min: 0.0,
                  max: 1.0,
                  step: 0.1,
                  hint:
                    'Predicts whether a track contains no vocals. “Ooh” and “aah” sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly “vocal”. The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0.'
                },
                {
                  type: 'key',
                  name: 'Key',
                  min: 1,
                  max: 12,
                  step: 1,
                  hint:
                    'The key the track is in. Integers map to pitches using standard Pitch Class notation. E.g. 0 = C, 1 = C♯/D♭, 2 = D, and so on.'
                },
                {
                  type: 'liveness',
                  name: 'Liveness',
                  min: 0.0,
                  max: 1.0,
                  step: 0.1,
                  hint:
                    'Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live.'
                },
                {
                  type: 'loadness',
                  name: 'Loudness',
                  min: -60,
                  max: 0,
                  step: 5,
                  hint:
                    'The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). Values typical range between -60 and 0 db.'
                },
                {
                  type: 'mode',
                  name: 'Mode',
                  min: 0,
                  max: 1,
                  step: 1,
                  hint:
                    'Mode indicates the modality (major or minor) of a track, the type of scale from which its melodic content is derived. Major is represented by 1 and minor is 0.'
                },
                {
                  type: 'popularity',
                  name: 'Popularity',
                  min: 0,
                  max: 100,
                  step: 10,
                  hint:
                    'The popularity of the track. The value will be between 0 and 100, with 100 being the most popular. The popularity is calculated by algorithm and is based, in the most part, on the total number of plays the track has had and how recent those plays are. Note: When applying track relinking via the market parameter, it is expected to find relinked tracks with popularities that do not match min_*, max_*and target_* popularities. These relinked tracks are accurate replacements for unplayable tracks with the expected popularity scores. Original, non-relinked tracks are available via the linked_from attribute of the relinked track response.'
                },
                {
                  type: 'speechiness',
                  name: 'Speechiness',
                  min: 0.0,
                  max: 1.0,
                  step: 0.1,
                  hint:
                    'Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 0.33 most likely represent music and other non-speech-like tracks.'
                },
                {
                  type: 'tempo',
                  name: 'Tempo',
                  min: 10,
                  max: 300,
                  step: 1,
                  hint:
                    'The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.'
                },
                {
                  type: 'time_signature',
                  name: 'Time signature',
                  min: 0,
                  max: 16,
                  step: 1,
                  hint:
                    'An estimated overall time signature of a track. The time signature (meter) is a notational convention to specify how many beats are in each bar (or measure).'
                },
                {
                  type: 'valence',
                  name: 'Valence',
                  min: 0.0,
                  max: 1.0,
                  step: 0.1,
                  hint:
                    'A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).'
                }
              ]}
              onChange={this.onSettingChanged}
            />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
export default PlaylistForm;
