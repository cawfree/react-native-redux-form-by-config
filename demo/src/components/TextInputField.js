import React from 'react';
import {
  View,
  TextInput,
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
    textInput: {
      fontSize: 16,
      flex: 1,
    },
  },
);

class TextInputField extends React.Component {
  render() {
    const { config, theme, disabled, input: { onChange, value, ...restInput }, meta: { touched, error, ...restMeta } } = this.props;
    const {
      style,
      numberOfLines,
      placeholder,
      label,
      ...restConfig
    } = config;
    const resolvedStyle = {
      ...(style || styles.textInput),
    };
    const resolvedNumberOfLines = numberOfLines || 1;
    const resolvedMultiline = resolvedNumberOfLines > 1;
    const resolvedPlaceholder = placeholder || label;
    const resolvedValue = value || '';
    return (
      <View
        style={[
          styles.container,
        ]}
      >
        <TextInput
          value={resolvedValue}
          onChangeText={onChange}
          editable={!disabled}
          underlineColorAndroid="transparent"
          style={style || styles.textInput}
          numberOfLines={resolvedNumberOfLines}
          multiline={resolvedMultiline}
          placeholder={resolvedPlaceholder}
          {...restConfig}
        />
      </View>
    );
  }
}

TextInputField.propTypes = {

};

TextInputField.defaultProps = {

};

export default withTheme(
  TextInputField,
);
