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


const getPickerItems = () => [];

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
      .map(({ value }) => value || null);
    return baseValues
      .filter(
        ({ value }, index) => rangeOfValues.indexOf(value || null) === index,
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
          value={value || null}
          selectedValue={`${value}`}
          onValueChange={(value, index) => {
            onChange(
              resolvedValues[index].value || null,
            );
          }}
          enabled={!disabled}
          mode={resolvedMode}
          {...restConfig}
        > 
          {resolvedValues.map(
            ({ value, label, ...extraProps }, index) => (
              <Picker.Item
                key={index}
                label={label}
                value={value}
                {...extraProps}
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
