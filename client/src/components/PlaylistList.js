import React, { Component } from 'react';
import { Table, Icon, Button } from 'react-materialize';

class PlaylistList extends Component {
  render() {
    const { items, publishPlaylist } = this.props;
    return (
      <Table centered bordered>
        <thead>
          <tr>
            <th data-field="name">Name</th>
            <th data-field="public">Public</th>
            <th data-field="public">Edit</th>
            <th data-field="public">Publish</th>
          </tr>
        </thead>
        <tbody>
          {items &&
            items.map(item => (
              <PlaylistRow
                key={item._id}
                item={item}
                publishPlaylist={publishPlaylist}
              />
            ))}
        </tbody>
      </Table>
    );
  }
}
export default PlaylistList;

const PlaylistRow = ({ item, publishPlaylist }) => (
  <tr>
    <td>{item.name}</td>
    <td>
      {item.options && item.options.public ? (
        <Icon>check_box_outline_blank</Icon>
      ) : (
        <Icon>ncheck_box</Icon>
      )}
    </td>
    <td>
      <Button>
        <Icon>edit</Icon>
      </Button>
    </td>
    <td>
      <Button onClick={() => publishPlaylist(item._id)}>
        <Icon>publish</Icon>
      </Button>
    </td>
  </tr>
);
