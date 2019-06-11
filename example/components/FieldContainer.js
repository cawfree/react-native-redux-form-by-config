import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import Collapsible from '@cawfree/react-native-collapsible-view';
import FontAwesomeIcon from 'react-native-vector-icons/dist/FontAwesome';

// TODO: needs theming

const marginShort = 5;
const thumbSize = 50;

const styles = StyleSheet.create(
  {
    container: {
      minHeight: 40,
    },
    children: {
      flex: 1,
    },
    fieldContainer: {
      borderRadius: 5, // TODO: marginShort, callstack
      overflow: 'hidden',
      flexDirection: 'row',
    },
    fieldErrorCaption: {
      height: 30,
      flexDirection: 'row',
      flex: 1,
    },
    fieldErrorContainer: {
      width: thumbSize,
      height: thumbSize,
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

export default class FieldContainer extends React.Component {
  render() {
    const {
      backgroundColor,
      children,
      touched,
      error,
      renderFieldError,
      collapsed,
      ...extraProps
    } = this.props;
    const shouldShowError = (!!touched && !!error);
    const shouldRenderFieldError = !!renderFieldError;
    return (
      <View
        style={styles.container}
      >
        <View
          style={[
            styles.fieldContainer,
            {
              backgroundColor,
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
              style={styles.fieldErrorContainer}
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

FieldContainer.propTypes = {
  backgroundColor: PropTypes.string,
  touched: PropTypes.bool,
  error: PropTypes.bool,
  renderFieldError: PropTypes.func,
};

FieldContainer.defaultProps = {
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
