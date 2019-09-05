import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  View,
  Animated,
  StyleSheet,
  Alert,
} from 'react-native';

class ProgressIndicator extends React.Component {
  // XXX: I use this too often. I need to place this somewhere.
  static hasLayout = (width, height) => (
    width !== undefined && height !== undefined && width !== null && height !== null && !Number.isNaN(width) && !Number.isNaN(height)
  );
  static getCurrentProgress = (value, minValue, maxValue) => (
    (value - minValue) / (maxValue - minValue)
  );
  state = {
    width: undefined,
    height: undefined,
    animValue: new Animated
      .Value(
        0,
      ),
  };
  onLayout = ({ nativeEvent: { layout: { width, height } } }) => this.setState(
    {
      width,
      height,
    },
  );
  shouldAnimateProgress = toValue => new Promise(
    resolve => Animated
      .timing(
        this.state.animValue,
        {
          toValue,
          duration: 500,
        },
      )
      .start(resolve),
  )
    .then(() => console.log('animated to '+toValue));
  async componentDidMount() {
    const {
      minValue,
      maxValue,
      value,
    } = this.props;
    const currentProgress = ProgressIndicator
      .getCurrentProgress(
        value,
        minValue,
        maxValue,
      );
    this.shouldAnimateProgress(
      currentProgress,
    );
  }
  async componentWillUpdate(nextProps, nextState) {
    const {
      minValue,
      maxValue,
      value,
    } = nextProps;
    const {
      minValue: lastMinValue,
      maxValue: lastMaxValue,
      value: lastValue,
    } = this.props;
    if (minValue !== lastMinValue || maxValue !== lastMaxValue || value !== lastValue) {
      const progress = ProgressIndicator
        .getCurrentProgress(
          value,
          minValue,
          maxValue,
        );
      return this.shouldAnimateProgress(
        progress,
      );
    }
    return Promise
      .resolve();
  }
  render() {
    const {
      containerStyle,
      minValue,
      maxValue,
      value,
      colorRange,
      ...extraProps
    } = this.props;
    const {
      width,
      height,
      animValue,
    } = this.state;
    const doesHaveLayout = ProgressIndicator
      .hasLayout(
        width,
        height,
      );
    return (
      <View
        style={[
          containerStyle,
        ]}
        onLayout={this.onLayout}
      >
        {(!!ProgressIndicator.hasLayout(
          width,
          height,
        ) && (
          <Animated.View
            style={[
              {
                position: 'absolute',
                // TODO: Come back here so we can useNativeDriver.
                width: Animated.multiply(
                  animValue,
                  width,
                ),
                height,
                backgroundColor: animValue
                  .interpolate(
                    colorRange,
                  ),
              },
            ]}
          />
        ))}
      </View>
    );
  }
}

const styles = StyleSheet
  .create(
    {
      containerStyle: {
        flex: 1,
      },
    },
  );

ProgressIndicator.propTypes = {
  containerStyle: PropTypes.shape({}),
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  value: PropTypes.number,
  colorRange: PropTypes.shape({}),
};

ProgressIndicator.defaultProps = {
  containerStyle: styles.containerStyle,
  minValue: 0,
  maxValue: 100,
  value: 75,
  colorRange: {
    inputRange: [
      0.0,
      0.5,
      1.0,
    ],
    outputRange: [
      'red',
      'yellow',
      'green',
    ],
  },
};

export default ProgressIndicator;
