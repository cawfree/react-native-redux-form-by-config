import React from 'react';
import {
  View,
  Picker,
  StyleSheet,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from './../theme';

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
    },
    enum: {
      fontSize: 16,
      flex: 1,
    },
  },
);


const values = [
  ['Option One', null],
  ['Option Two', 'hello'],
];

//<TextInput
//          value={resolvedValue}
//          onChangeText={onChange}
//          editable={!disabled}
//          underlineColorAndroid="transparent"
//          style={style || styles.textInput}
//          numberOfLines={resolvedNumberOfLines}
//          multiline={resolvedMultiline}
//          placeholder={resolvedPlaceholder}
//          {...restConfig}
//        />

const getPickerItems = () => [];

//<Picker
//          enabled={!(year < 0)}
//          style={monthStyle}
//          mode={mode}
//          value={month}
//          selectedValue={month}
//          onValueChange={(i) => {
//            const month = Number.parseInt(i);
//            return this.onMonthPicked(Number.isNaN(month) ? -1 : month);
//          }}
//        >

const sanitizeValues = (values = []) => {
  if (Array.isArray(values)) {
    const baseValues = values
      .reduce(
        (arr, obj) => {
          if (typeof obj === 'object') {
            const { label } = obj;
            if (typeof label === 'string') {
              return [
                ...arr,
                obj,
              ];
            }
          }
          return arr;
        },
        [],
      );
    // XXX: Ensure each value corresponds to a unique index.
    const rangeOfValues = baseValues
      .map(({ value }) => value);
    return baseValues
      .filter(
        ({ value }, index) => rangeOfValues.indexOf(value) === index,
      );
  }
  return [];
};

class EnumField extends React.Component {
  render() {
    const { config, theme, disabled, input: { onChange, value, ...restInput }, meta: { touched, error, ...restMeta } } = this.props;
    const {
      style,
      mode,
      values,
      nilPrompt,
      ...restConfig
    } = config;
    const resolvedStyle = {
      ...(style || styles.enum),
    };
    const resolvedMode = mode || (Platform.OS === 'android' ? 'dropdown' : undefined);
    const resolvedValues = sanitizeValues(
      values,
    );
    return (
      <View
        style={[
          styles.container,
        ]}
      >
        <Picker
          style={resolvedStyle}
          value={value}
          selectedValue={value}
          onValueChange={(value) => {
            console.log('set value');
            onChange(value);
          }}
          enabled={!disabled}
          mode={resolvedMode}
          {...restConfig}
        > 
          {resolvedValues.map(
            ({ value, label }, index) => (
              <Picker.Item
                key={index}
                label={label}
                value={value}
              />
            ),
          )}
        </Picker>
      </View>
    );
  }
}

EnumField.propTypes = {

};

EnumField.defaultProps = {

};

export default withTheme(
  EnumField,
);
