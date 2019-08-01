import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import PropTypes from 'prop-types';
import Hyperlink from 'react-native-hyperlink'; 
import FontAwesomeIcon from 'react-native-vector-icons/dist/FontAwesome';

import { withTheme } from './../theme';

const openUrl = url => Linking.canOpenURL(url)
  .then((isSupported) => {
    if (isSupported) {
      return Linking
        .openURL(url);
    }
    return Promise.reject(
      new Error(
        `Failed to open "${url}".`,
      ),
    );
  });

const styles = StyleSheet.create(
  {
    container: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
    },
    touchableOpacity: {
      justifyContent: 'center',
    },
    description: {
      flex: 1,
    },
    text: {
      flex: 1,
    },
  },
);

const CheckBoxField =  ({ theme, config, disabled, input: { onChange, value, ...restInput }, meta: { touched, error, ...restMeta }}) => {
  const {
    style,
    description,
    ...restConfig
  } = config;
  const {
    minFieldHeight,
    linkStyle,
  } = theme;
  const resolvedStyle = style || styles.text;
  const resolvedDescription = description || '';
  const resolvedValue = !!value;
  const shouldUseHyperlink = (typeof resolvedDescription !== 'string') && resolvedDescription.length === 2;
  return (
    <View
      style={[
        styles.container,
        {
          minHeight: minFieldHeight,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.touchableOpacity,
          {
            width: minFieldHeight * 0.6,
            height: minFieldHeight,
          },
        ]}
        disabled={disabled}
        onPress={() => onChange(!resolvedValue)}
      >
        <FontAwesomeIcon
          size={20}
          name={resolvedValue ? 'check-square' : 'square'}
          {...restConfig}
        />
      </TouchableOpacity>
      <View
        style={styles.description}
      >
        {(shouldUseHyperlink) ? (
          <Hyperlink
            style={resolvedStyle}
            onPress={openUrl}
            linkStyle={linkStyle}
            linkText={() => resolvedDescription[1]}
          >
            <Text
              style={resolvedStyle}
            >
              {resolvedDescription[0]}
            </Text>
          </Hyperlink>
        ) : (
          <Text
            style={resolvedStyle}
          >
            {resolvedDescription}
          </Text>
        )}
      </View>
    </View>
  );
};

CheckBoxField.propTypes = {
  linkStyle: PropTypes.shape({}),
};

CheckBoxField.defaultProps = {
  linkStyle: styles.linkStyle,
};

export default withTheme(
  CheckBoxField,
);
