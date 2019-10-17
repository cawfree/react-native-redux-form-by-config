import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
} from 'react-native';
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
    const { config, disabled, input: { onChange, value } } = this.props;
    const {
      style,
      numberOfLines,
      placeholder,
      label,
      ...restConfig
    } = config;
    const resolvedNumberOfLines = numberOfLines || 1;
    const resolvedMultiline = resolvedNumberOfLines > 1;
    const resolvedPlaceholder = placeholder || label;
    const resolvedValue = value || '';
    return (
      <View
        style={styles.container}
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
  ...TextInput.propTypes,
};

TextInputField.defaultProps = {
  ...TextInput.defaultProps,
};

export default withTheme(
  TextInputField,
);
