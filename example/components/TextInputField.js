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
      justifyContent: 'center',
      flex:1,
      flexDirection: 'row',
    },
    textInput: {
      minHeight: 40,
      fontSize: 16,
      flex: 1,
    },
  },
);

const TextInputField = ({ config, linkStyle, input: { onChange, value, ...restInput }, meta: { touched, error, ...restMeta}}) => {
  const {
    style,
    numberOfLines,
    placeholder,
    ...restConfig
  } = config;
  const resolvedStyle = style || styles.textInput;
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
};

TextInputField.propTypes = {

};

TextInputField.defaultProps = {

};

export default TextInputField;
