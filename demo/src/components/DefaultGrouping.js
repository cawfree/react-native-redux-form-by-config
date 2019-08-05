import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
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

const DefaultGrouping = ({ children, ...extraProps }) => (
  <View
    style={styles.container}
  >
    {children}
  </View>
);

DefaultGrouping.propTypes = {
  children: PropTypes.arrayOf([]),
};

DefaultGrouping.defaultProps = {
  children: [],
};

export default DefaultGrouping;
