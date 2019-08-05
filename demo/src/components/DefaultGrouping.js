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

const DefaultGrouping = ({ values, index, children, ...extraProps }) => (
  <View
    style={styles.container}
  >
    <Text
      style={{
        color: 'white',
        paddingBottom: 5,
      }}
    >
      {'Hello'}
    </Text>
    <View
      style={{
        flex: 1,
      }}
    >
      {children}
    </View>
  </View>
);

DefaultGrouping.propTypes = {
  children: PropTypes.arrayOf([]),
};

DefaultGrouping.defaultProps = {
  children: [],
};

export default DefaultGrouping;
