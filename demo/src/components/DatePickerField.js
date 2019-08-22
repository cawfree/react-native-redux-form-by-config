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
import SimplerDatePicker from '@cawfree/react-native-simpler-date-picker';

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
      format,
      minDate,
      maxDate,
      ...restConfig
    } = config;
    // TODO: needs finishing
    //minDate={Moment('2016/09/02', 'YYYY/MM/DD')}
    //maxDate={Moment('2019/09/02', 'YYYY/MM/DD')}
    // TODO:
    return (
      <View
        style={[
          styles.container,
        ]}
      >
        <SimplerDatePicker
          minDate={minDate && (Moment(minDate, format))}
          maxDate={maxDate && (Moment(maxDate, format))}
          date={value && (Moment(value, format))}
          onDatePicked={(moment) => {
            if (moment) {
              return onChange(moment.format(format));
            }
            return onChange(null);
          }}
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
