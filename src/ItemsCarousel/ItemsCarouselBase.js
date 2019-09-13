import React from 'react';
import { Motion, spring } from 'react-motion';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import userPropTypes from './userPropTypes';
import {
  calculateItemWidth,
  calculateItemLeftGutter,
  calculateItemRightGutter,
  calculateTranslateX,
  showLeftChevron,
  showRightChevron,
  calculateNextIndex,
  calculatePreviousIndex,
} from './helpers';

const CarouselWrapper = styled.div`
  position: relative;
  ${(props) => props.height && `height: ${props.height}px;`}
`;

const Wrapper = styled.div`
  width: 100%;
  overflow-x: hidden;
`;

const SliderItemsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
`;

const SliderItem = styled.div`
  width: ${(props) => props.width}px;
  flex-shrink: 0;
  margin-right: ${(props) => props.rightGutter}px;
  margin-left: ${(props) => props.leftGutter}px;
`;

const CarouselChevron = styled.div`
  position: absolute;
  height: 100%;
  width: ${(props) => props.chevronWidth + 1}px;
  cursor: pointer;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CarouselRightChevron = styled(props => <CarouselChevron {...props} />)`
  right: -${(props) => props.outsideChevron ? props.chevronWidth : 0}px;
`;

const CarouselLeftChevron = styled(props => <CarouselChevron {...props} />)`
  left: -${(props) => props.outsideChevron ? props.chevronWidth : 0}px;
`;

class ItemsCarouselBase extends React.Component {
  getItems = () => {
    const {
      isPlaceholderMode,
      placeholderItem,
      numberOfPlaceholderItems,
    } = this.props;

    if (isPlaceholderMode) {
      return Array.from(Array(numberOfPlaceholderItems)).map(index => placeholderItem);
    }

    return this.props.children;
  };

  renderList({ items, translateX, containerWidth, measureRef }) {
    const {
      gutter,
      numberOfCards,
      firstAndLastGutter,
      showSlither,
    } = this.props;

    return (
      <Wrapper>
        <SliderItemsWrapper
          ref={measureRef}
          style={{
            transform: `translateX(${translateX * -1}px)`,
          }}
        >
          {items.map((child, index) => (
            <SliderItem
              key={index}
              width={calculateItemWidth({
                firstAndLastGutter,
                containerWidth,
                gutter,
                numberOfCards,
                showSlither,
              })}
              leftGutter={calculateItemLeftGutter({
                index,
                firstAndLastGutter,
                gutter,
              })}
              rightGutter={calculateItemRightGutter({
                index,
                firstAndLastGutter,
                gutter,
                numberOfChildren: items.length,
              })}
            >
              {child}
            </SliderItem>
          ))}
        </SliderItemsWrapper>
      </Wrapper>
    );
  }

  render() {
    let {
      // Props coming from withContainerWidth
      containerWidth,
      measureRef,
      // Props coming from user
      gutter,
      numberOfCards,
      firstAndLastGutter,
      activeItemIndex,
      activePosition,
      springConfig,
      showSlither,
      rightChevron,
      leftChevron,
      chevronWidth,
      outsideChevron,
      requestToChangeActive,
      slidesToScroll,
      ...props
    } = this.props;

    const items = this.getItems();

    const translateX = calculateTranslateX({
      activeItemIndex,
      activePosition,
      containerWidth,
      numberOfChildren: items.length,
      numberOfCards,
      gutter,
      firstAndLastGutter,
      showSlither,
    });

    const _showRightChevron = rightChevron && showRightChevron({
      activeItemIndex,
      activePosition,
      numberOfChildren: items.length,
      numberOfCards,
      slidesToScroll,
    });

    const _showLeftChevron = leftChevron && showLeftChevron({
      activeItemIndex,
      activePosition,
      numberOfChildren: items.length,
      numberOfCards,
      slidesToScroll,
    });

    return (
      <CarouselWrapper
        {...props}
      >
        <Motion
          defaultStyle={{
            translateX,
          }}
          style={{
            translateX: spring(translateX, springConfig),
          }}
          children={({ translateX }) => this.renderList({
            items,
            measureRef,
            containerWidth,
            translateX,
          })}
        />
        {
          _showRightChevron &&
          <CarouselRightChevron
            chevronWidth={chevronWidth}
            outsideChevron={outsideChevron}
            onClick={() => requestToChangeActive(calculateNextIndex({
              activePosition,
              activeItemIndex,
              numberOfCards,
              slidesToScroll,
              numberOfChildren: items.length,
            }))}
          >
            {rightChevron}
          </CarouselRightChevron>
        }
        {
          _showLeftChevron &&
          <CarouselLeftChevron
            chevronWidth={chevronWidth}
            outsideChevron={outsideChevron}
            onClick={() => requestToChangeActive(calculatePreviousIndex({
              activePosition,
              activeItemIndex,
              numberOfCards,
              slidesToScroll,
              numberOfChildren: items.length,
            }))}
          >
            {leftChevron}
          </CarouselLeftChevron>
        }
      </CarouselWrapper>
    );
  }
}

ItemsCarouselBase.defaultProps = {
  onWrapperTouchStart: null,
  onWrapperTouchEnd: null,
  onWrapperTouchMove: null,
};

ItemsCarouselBase.propTypes = {
  ...userPropTypes,
  // Props coming from withPlaceholderMode
  isPlaceholderMode: PropTypes.bool.isRequired,
  // Props coming from withContainerWidth
  containerWidth: PropTypes.number.isRequired,
  measureRef: PropTypes.object.isRequired,
};

export default ItemsCarouselBase;