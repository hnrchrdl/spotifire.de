import React from 'react';
import * as api from '../lib/api';
import withUserContext from '../hoc/withUserContext';
import SeedPickerItemsList from './SeedPickerItemsList';
import { Input, Button, Modal } from 'react-materialize';
import propTypes from 'prop-types';

class SeedPicker extends React.Component {
  static propTypes = {
    type: propTypes.string.isRequired,
    selected: propTypes.array.isRequired,
    onChange: propTypes.func.isRequired,
    disabled: propTypes.bool.isRequired
  };
  constructor() {
    super();
    this.state = {
      items: null,
      limit: 20,
      offset: 0,
      time_range: 'long_term'
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
    api
      .getTop(
        this.props.user.id,
        this.props.type,
        this.state.limit,
        this.state.offset,
        this.state.time_range
      )
      .then(({ data }) => {
        this.setState(state => {
          const { items } = data.body;
          this.props.selected.forEach(selectedId => {
            const prevItem = state.items.find(item => item.id === selectedId);
            if (prevItem && !items.find(item => item.id === selectedId)) {
              items.push(prevItem);
            }
          });
          return { items };
        });
      });
  };
  onSelect = item => {
    this.props.onChange({
      type: this.props.type,
      id: item.id
    });
  };
  loadMore = () => {
    this.setState(
      state => ({
        limit: state.limit + 10
      }),
      () => {
        this.getData();
      }
    );
  };
  handleTimeRangeChanged = e => {
    this.setState(
      {
        limit: 20,
        time_range: e.target.value
      },
      () => {
        this.getData();
      }
    );
  };

  render() {
    const { items } = this.state;

    if (!items) {
      return null;
    }
    const selected = items.filter(item =>
      (this.props.selected || []).includes(item.id)
    );
    const notSelected = items.filter(
      item => !(this.props.selected || []).includes(item.id)
    );
    return (
      <React.Fragment>
        <Modal
          trigger={
            <Button flat className="right" waves="light" icon="settings" />
          }
        >
          <Input
            s={4}
            type="select"
            label="Time range to base results on"
            defaultValue={this.state.time_range}
            onChange={this.handleTimeRangeChanged}
          >
            <option value="long_term">Long term</option>
            <option value="medium_term">Medium term</option>
            <option value="short_term">Short term</option>
          </Input>
        </Modal>
        {/* <Button flat className="right" waves="light" icon="search" /> */}
        <div className="space-bottom clearfloat" />
        {selected.length > 0 && (
          <SeedPickerItemsList
            items={selected}
            select={this.onSelect}
            isSelected={true}
          />
        )}
        <SeedPickerItemsList
          items={notSelected}
          select={this.onSelect}
          loadMore={this.loadMore}
          hasMore={this.state.limit < 50}
          disabled={this.props.disabled}
        />
        <div className="clearfloat" />
      </React.Fragment>
    );
  }
}
export default withUserContext(SeedPicker);
