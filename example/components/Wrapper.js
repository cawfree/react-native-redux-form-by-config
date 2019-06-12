import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import Collapsible from '@cawfree/react-native-collapsible-view';
import FontAwesomeIcon from 'react-native-vector-icons/dist/FontAwesome';

const styles = StyleSheet.create(
  {
    children: {
      flex: 1,
      minHeight: 40,
    },
    fieldContainer: {
      overflow: 'hidden',
      flexDirection: 'row',
    },
    fieldErrorCaption: {
      height: 30,
      flexDirection: 'row',
      flex: 1,
    },
    fieldErrorContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    fieldErrorCaptionContainer: {
      flex: 1,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    error: {
      height: 25,
      color: '#FF0000FF',
    },
  },
);

class Wrapper extends React.Component {
  render() {
    const {
      type,
      style,
      children,
      touched,
      error,
      renderFieldError,
      collapsed,
      theme,
      ...extraProps
    } = this.props;
    const {
      marginShort,
      thumbSize,
      backgroundColor,
    } = theme;
    const shouldShowError = (!!touched && !!error);
    const shouldRenderFieldError = (!!renderFieldError) && (type !== 'boolean');
    return (
      <View>
        <View
          style={[
            styles.fieldContainer,
            {
              backgroundColor: (type === 'boolean' ? 'transparent' : backgroundColor),
              borderRadius: marginShort,
            },
          ]}
        >
          <View
            style={styles.children}
          >
            {children}
          </View>
          {(shouldRenderFieldError) && (
            <View
              style={[
                styles.fieldErrorContainer,
                {
                  width: thumbSize,
                  height: thumbSize,
                },
              ]}
            >
              {(!!touched && !!error) && (
                renderFieldError()
              )}
            </View>
          )}
        </View>
        <View
          style={{
            minHeight: marginShort,
          }}
        >
          <Collapsible
            collapsed={!shouldShowError}
          >
            <View
              style={styles.fieldErrorCaption}
            >
              <View
                style={styles.fieldErrorCaptionContainer}
              >
                <Text
                  style={styles.error}
                >
                  {error}
                </Text>
              </View>
            </View>
          </Collapsible>
        </View>
      </View>
    );
  }
}

Wrapper.propTypes = {
  backgroundColor: PropTypes.string,
  touched: PropTypes.bool,
  error: PropTypes.bool,
  renderFieldError: PropTypes.func,
};

Wrapper.defaultProps = {
  backgroundColor: '#FFFFFFFF',
  touched: false,
  error: false,
  renderFieldError: () => (
    <FontAwesomeIcon
      name="exclamation-triangle"
      size={17}
      color="lightgrey"
    />
  ),
};

export default Wrapper;
