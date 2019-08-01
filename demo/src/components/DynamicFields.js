import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import Collapsible from '@cawfree/react-native-collapsible-view';
import { Field } from 'redux-form/immutable';
import { isEqual } from 'lodash';

import { withTheme } from './../theme';

const styles = StyleSheet
  .create(
    {
      defaultLayout: {
        flex: 1,
        flexDirection: 'column',
      },
      defaultField: {
        flex: 1,
      },
      defaultBoolean: {
        flex: 1,
      },
      defaultText: {
        flex: 1,
        backgroundColor: 'white',
      },
      defaultError: {
        flex: 1,
        backgroundColor: 'orange',
      },
      errorText: {
        flex: 1,
        backgroundColor: 'green',
      },
    },
  );

const DefaultFieldWrapper = withTheme(
  ({ theme, meta, config, children, ...extraProps }) => {
    const { type } = config;
    const {
      error,
      touched,
    } = meta;
    const {
      borderRadius,
      marginShort,
      marginExtraShort,
    } = theme;
    const shouldShowError = !!(touched && error);
    return (
      <View
        style={styles.defaultField}
      >
        {(type === 'boolean') && (
          <View
            style={[
              styles.defaultBoolean,
            ]}
          >
            {children}
          </View>
        )}
        {(type !== 'boolean') && (
          <View
            style={[
              styles.defaultText,
              {
                borderRadius,
                padding: marginExtraShort,
              },
            ]}
          >
            {children}
          </View>
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
              style={styles.errorText}
            >
              {error}
            </Text>
          </Collapsible>
        </View>
      </View>
    );
  },
);

class DynamicFields extends React.Component {
  constructor(nextProps) {
    super(nextProps);
    const {
      config,
      disabled,
      types,
      validation,
      theme,
      FieldWrapper,
    } = nextProps;
    const cleanConfig = config
      .filter((e) => {
        const {
          key,
          label,
          type,
        } = e;
        return key && type && label;
      });
    this.state = ({
      fields: cleanConfig.reduce(
        (arr, el, i) => {
          const {
            key,
            type,
            label,
            disabled,
            ...restConfig
          } = el;
          const resolvedLabel = (label || key);
          const validate = (validation[type] || (() => []))(el);
          const FieldImpl = types[type];
          if (!FieldImpl) {
            throw new Error(
              `Missing implementation of data type "${type}"!`,
            );
          }
          return ([
            ...arr,
            <Field
              key={key}
              name={key}
              component={({ meta, ...extraProps }) => (
                <FieldWrapper
                  {...extraProps}
                  meta={meta}
                  theme={theme}
                  config={el}
                >
                  <FieldImpl
                    {...extraProps}
                    meta={meta}
                    config={restConfig}
                    disabled={disabled}
                  />
                </FieldWrapper>
              )}
              validate={validate}
            />
          ]);
        },
        [],
      ),
    });
  }
  componentDidMount() {
    const {
      handleSubmit,
      onHandleSubmit,
    } = this.props;
    if (onHandleSubmit) {
      onHandleSubmit(handleSubmit);
    }
  }
  componentWillUpdate(nextProps, nextState) {
    const {
      formSyncErrors,
      onHandleFormSyncErrors,
    } = nextProps;
    const syncErrorsChanged = !isEqual(
      formSyncErrors,
      this.props.formSyncErrors,
    );
    if (syncErrorsChanged && onHandleFormSyncErrors) {
      onHandleFormSyncErrors(
        formSyncErrors,
      );
    }
  }
  render() {
    const {
      LayoutComponent,
      theme,
      ...extraProps
    } = this.props;
    const {
      fields,
      ...nextState
    } = this.state;
    return (
      <LayoutComponent
      >
        {fields}
      </LayoutComponent>
    );
  }
}

DynamicFields.propTypes = {
  theme: PropTypes.shape({}),
  LayoutComponent: PropTypes.func,
  disabled: PropTypes.bool,
  LayoutComponent: PropTypes.func,
  FieldWrapper: PropTypes.func,
};

DynamicFields.defaultProps = {
  theme: undefined,
  disabled: false,
  LayoutComponent: ({ children }) => (
    <View
      style={styles.defaultLayout}
    >
      {children}
    </View>
  ),
  FieldWrapper: DefaultFieldWrapper,
};

export default withTheme(
  DynamicFields,
);
