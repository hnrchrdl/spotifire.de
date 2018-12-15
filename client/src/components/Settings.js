import React from 'react';
import propTypes from 'prop-types';
import { Input, Row } from 'react-materialize';

class Settings extends React.Component {
  static propTypes = {
    items: propTypes.array.isRequired,
    onChange: propTypes.func.isRequired
  };

  settingChange = ({ kind, type, value }) => {
    const item = this.props.items.find(item => (item.type = type));
    const valid = item.min <= value && item.max >= value;
    if (valid) {
      this.props.onChange({ type: `${kind}_${type}`, value: value });
    }
  };

  render() {
    const { items } = this.props;
    return (
      <React.Fragment>
        {items &&
          items.map(item => (
            <Row key={item.type}>
              <h6>{item.name}</h6>
              <p>{item.hint}</p>
              <Input
                s={4}
                placeholder={`Min ${item.name}`}
                label={`Min ${item.name}`}
                onChange={e =>
                  this.settingChange({
                    kind: 'min',
                    type: `${item.type}`,
                    value: e.target.value
                  })
                }
              />
              <Input
                s={4}
                placeholder={`Target ${item.name}`}
                label={`Target ${item.name}`}
                onChange={e =>
                  this.settingChange({
                    kind: 'target',
                    type: `${item.type}`,
                    value: e.target.value
                  })
                }
              />
              <Input
                s={4}
                placeholder={`Max ${item.name}`}
                label={`Max ${item.name}`}
                onChange={e =>
                  this.settingChange({
                    kind: 'max',
                    type: `${item.type}`,
                    value: e.target.value
                  })
                }
              />
            </Row>
          ))}
      </React.Fragment>
    );
  }
}

export default Settings;
