import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

const styles = StyleSheet
  .create(
    {
      container: {
        flex: 1,
        padding: 5,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: 'lightgrey',
      },
    },
  );

class DefaultGrouping extends React.Component {
  constructor(props) {
    super(props);
    const { children } = props;
    this.state = {
      children: children
        .map(
          (Child, i) => (
            <Child
              key={i}
            />
          ),
        ),
    };
  }
  render() {
    const {
      values,
      index,
      ...extraProps
    } = this.props;
    const { children } = this.state;
    return (
      <View
        style={styles.container}
      >
        {children}
      </View>
    );
  }
}

DefaultGrouping.propTypes = {
  children: PropTypes.arrayOf([]),
};

DefaultGrouping.defaultProps = {
  children: [],
};

export default DefaultGrouping;
