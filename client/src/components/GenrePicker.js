import React from 'react';
import * as api from '../lib/api';
import withUserContext from '../hoc/withUserContext';
import SeedPickerItemsList from './SeedPickerItemsList';
import { Button } from 'react-materialize';
import propTypes from 'prop-types';

class GenrePicker extends React.Component {
  static propTypes = {
    selected: propTypes.array.isRequired,
    onChange: propTypes.func.isRequired,
    disabled: propTypes.bool.isRequired
  };
  constructor() {
    super();
    this.state = {
      items: null
    };
  }
  componentWillMount() {
    if (this.props.user) {
      this.getData();
    }
  }
  componentDidUpdate(prevProps) {
    if (
      this.props.user &&
      (!prevProps.user || prevProps.user.id !== this.props.user.id)
    ) {
      this.getData();
    }
  }
  getData = () => {
    api.getGenreSeeds(this.props.user.id).then(({ data }) => {
      this.setState(state => {
        const { genres } = data.body;
        return { genres };
      });
    });
  };
  onSelect = item => {
    this.props.onChange({
      type: 'genres',
      id: item.id
    });
  };

  render() {
    const { genres } = this.state;
    if (!genres) {
      return null;
    }
    const items = genres.map(item => ({ id: item, name: item, type: 'genre' }));
    const selected = items.filter(item =>
      (this.props.selected || []).includes(item.id)
    );
    const notSelected = items.filter(
      item => !(this.props.selected || []).includes(item.id)
    );
    return (
      <React.Fragment>
        <Button flat className="right" waves="light" icon="search" />
        <div className="space-bottom clearfloat" />
        {selected.length > 0 && (
          <SeedPickerItemsList
            type="genres"
            items={selected}
            select={this.onSelect}
            isSelected={true}
          />
        )}
        <SeedPickerItemsList
          type="genres"
          items={notSelected}
          select={this.onSelect}
          disabled={this.props.disabled}
        />
      </React.Fragment>
    );
  }
}
export default withUserContext(GenrePicker);
