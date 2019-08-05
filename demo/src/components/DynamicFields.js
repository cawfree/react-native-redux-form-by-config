import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
} from 'react-native';
import { Field } from 'redux-form/immutable';
import { isEqual } from 'lodash';

import { withTheme } from './../theme';

import DefaultFieldWrapper from './DefaultFieldWrapper';
import DefaultGrouping from './DefaultGrouping';

const styles = StyleSheet
  .create(
    {
      defaultLayout: {
        flex: 1,
        flexDirection: 'column',
      },
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
      cleanConfig,
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
      grouping,
      LayoutComponent,
      GroupingComponent,
      theme,
      // TODO: What to do with extraProps?
      ...extraProps
    } = this.props;
    const { cleanConfig, fields } = this.state;
    return (
      <LayoutComponent
      >
        {(grouping.length > 0) && (
          grouping
            .map(
              (config, index) => {
                const { keys } = config;
                return (
                  <GroupingComponent
                    {...config}
                    index={index}
                  >
                    {keys
                      .map(
                        key => fields[cleanConfig.map(({ key }) => key).indexOf(key)],
                      )}
                  </GroupingComponent>
                );
              },
            )
        )}
        {(grouping.length <= 0) && (
          fields
        )}
      </LayoutComponent>
    );
  }
}

DynamicFields.propTypes = {
  theme: PropTypes.shape({}),
  LayoutComponent: PropTypes.func,
  disabled: PropTypes.bool,
  FieldWrapper: PropTypes.func,
  GroupingComponent: PropTypes.func,
  grouping: PropTypes.arrayOf(
    PropTypes.shape(
      {
        keys: PropTypes.arrayOf(
          PropTypes.string,
        ),
      },
    ),
  ),
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
  GroupingComponent: DefaultGrouping,
  grouping: [],
};

export default withTheme(
  DynamicFields,
);
