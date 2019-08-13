import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Platform,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { SimpleDatePicker } from '@cawfree/react-native-simple-date-picker';

import { withTheme } from './../theme';

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
    },
    datePicker: {
      fontSize: 16,
      flex: 1,
    },
    yearCell: {
      flex: 1,
      borderWidth: 1,
      overflow: 'hidden',
    },
  },
);

class DatePickerField extends React.Component {
  render() {
    const { config, theme, disabled, input: { onChange, value, ...restInput }, meta: { touched, error, ...restMeta } } = this.props;
    const {
      style,
      min,
      max,
      //numberOfLines,
      //placeholder,
      ...restConfig
    } = config;
    return (
      <View
        style={[
          styles.container,
        ]}
      >
        <SimpleDatePicker
        />
      </View>
    );
  }
}

DatePickerField.propTypes = {
  yearRowLength: PropTypes.number,
};

DatePickerField.defaultProps = {
  yearRowLength: 3,
};

export default withTheme(
  DatePickerField,
);
