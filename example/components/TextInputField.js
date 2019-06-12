import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

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
    const { config, theme, input: { onChange, value, ...restInput }, meta: { touched, error, ...restMeta} } = this.props;
    const {
      style,
      numberOfLines,
      placeholder,
      ...restConfig
    } = config;
    const {
      thumbSize,
    } = theme;
    const resolvedStyle = style || {
      ...styles.textInput,
      minHeight: thumbSize,
    };
    const resolvedNumberOfLines = numberOfLines || 1;
    const resolvedMultiline = resolvedNumberOfLines > 1;
    const resolvedPlaceholder = placeholder || '';
    const resolvedValue = value|| '';
    return (
      <View
        style={styles.container}
      >
        <TextInput
          value={resolvedValue}
          onChangeText={onChange}
          underlineColorAndroid="transparent"
          style={resolvedStyle}
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

export default TextInputField;
