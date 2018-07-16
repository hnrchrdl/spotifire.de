import React from 'react';
import propTypes from 'prop-types';
import { Row, Col, Chip } from 'react-materialize';
const SeedPickerItemsList = ({
  items,
  select,
  isSelected,
  loadMore,
  hasMore,
  disabled
}) => (
  <Row>
    <Col s={12}>
      {items &&
        items.map(item => (
          <Chip
            key={item.id}
            className={disabled ? 'disabled' : 'enabled'}
            onClick={() => select(item)}
            close={isSelected}
          >
            {item.images &&
              item.images.length >= 1 && (
                <img src={item.images[0].url} alt="" />
              )}
            {item.type === 'artist' && item.name}
            {item.type === 'track' &&
              item.artists.map(artist => artist.name).join(', ') +
                ': ' +
                item.name}
            {item.type === 'genre' && item.name}
          </Chip>
        ))}
      {!isSelected && hasMore && <Chip onClick={loadMore}>...</Chip>}
    </Col>
  </Row>
);
SeedPickerItemsList.propTypes = {
  items: propTypes.array.isRequired,
  select: propTypes.func.isRequired,
  loadMore: propTypes.func,
  hasMore: propTypes.bool,
  disabled: propTypes.bool
};
export default SeedPickerItemsList;
