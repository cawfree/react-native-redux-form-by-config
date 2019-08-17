import React from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/dist/FontAwesome';
import Collapsible from '@cawfree/react-native-collapsible-view';

import { withTheme } from '../theme';

const styles = StyleSheet
  .create(
    {
      defaultField: {
        flex: 1,
      },
      defaultBoolean: {
        flex: 1,
      },
      defaultErrorIcon: {
        alignItems: 'center',
        justifyContent: 'center',
      },
      defaultText: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'center',
      },
      defaultError: {
        flex: 1,
      },
      errorText: {
        flex: 1,
      },
    },
  );

const DefaultFieldWrapper = withTheme(
  ({ theme, meta, disabled, config, children: Child, ...extraProps }) => {
    const {
      label,
      type,
    } = config;
    const {
      error,
      touched,
    } = meta;
    const {
      borderRadius,
      marginShort,
      marginExtraShort,
      minFieldHeight,
      labelStyle,
    } = theme;
    const shouldShowError = !!(touched && error);
    return (
      <View
        style={styles.defaultField}
      >
        {(type !== label) && (
          <React.Fragment>
            {(type === 'boolean') && (
              <View
                style={[
                  styles.defaultBoolean,
                ]}
              >
                <Child
                  {...extraProps}
                  meta={meta}
                  config={config}
                  disabled={disabled}
                />
              </View>
            )}
            {(type !== 'boolean') && (
              <View
                style={[
                  styles.defaultText,
                  {
                    borderRadius,
                    minHeight: minFieldHeight,
                    paddingLeft: marginExtraShort,
                  },
                ]}
              >
                <Child
                  {...extraProps}
                  meta={meta}
                  config={config}
                  disabled={disabled}
                />
                <View
                  style={[
                    styles.defaultErrorIcon,
                    {
                      width: minFieldHeight,
                      height: minFieldHeight,
                      opacity: shouldShowError ? 1 : 0,
                    },
                  ]}
                >
                  <FontAwesomeIcon
                    name="exclamation-triangle"
                    size={20}
                    color="lightgrey"
                  />
                </View>
              </View>
            )}
          </React.Fragment>
        )}
        <View
          style={[
            styles.defaultError,
            {
              paddingBottom: marginShort,
            },
          ]}
        >
          <Collapsible
            collapsed={!shouldShowError}
          >
            <Text
              style={{
                ...theme.errorStyle,
                marginTop: marginExtraShort,
                flex: 1,
                textAlign: 'right',
              }}
            >
              {error}
            </Text>
          </Collapsible>
        </View>
      </View>
    );
  },
);

export default DefaultFieldWrapper;
