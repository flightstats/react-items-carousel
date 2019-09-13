import React from 'react';
import withContainerWidth from './withContainerWidth';
import pipe from './pipe';
import ItemsCarouselBase from './ItemsCarouselBase';
import userPropTypes from './userPropTypes';
import withPlaceholderMode from './withPlaceholderMode';

const ItemsCarousel = pipe(
  withContainerWidth(),
  withPlaceholderMode(),
)(ItemsCarouselBase);

ItemsCarousel.propTypes = userPropTypes;

ItemsCarousel.defaultProps = {
  numberOfCards: 3,
  gutter: 0,
  disableSwipe: false,
  firstAndLastGutter: false,
  showSlither: false,
  enablePlaceholder: false,
  activePosition: 'left',
  slidesToScroll: 1,
  placeholderItem: null,
  numberOfPlaceholderItems: 0,
  rightChevron: null,
  leftChevron: null,
};

export default ItemsCarousel;