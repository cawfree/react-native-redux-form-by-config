import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
} from 'react-native';
import { Map } from 'immutable';
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
      grouping,
      GroupingComponent,
      formValueSelector,
      getFormValues,
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
    const baseFields = cleanConfig.reduce(
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
          console.warn(
            `Missing implementation of data type "${type}"!`,
          );
        }
        return ([
          ...arr,
          ({ ...nextProps}) => (
            <Field
              key={key}
              name={key}
              component={({ meta, ...extraProps }) => (
                <FieldWrapper
                  {...nextProps}
                  {...extraProps}
                  meta={meta}
                  theme={theme}
                  config={el}
                >
                  {FieldImpl}
                </FieldWrapper>
              )}
              validate={validate}
            />
          ),
        ]);
      },
      [],
    ); 
    const baseGrouping = grouping
      .map(
        (config, index) => {
          const { keys } = config;
          return ({ getValuesFor, ...extraProps }) => (
            <GroupingComponent
              {...config}
              index={index}
              values={getValuesFor(keys)}
            >
              {keys
                .map(
                  key => baseFields[cleanConfig.map(({ key }) => key).indexOf(key)],
                )}
            </GroupingComponent>
          );
        },
      );
    this.state = ({
      baseFields: baseFields
        .map(
          BaseField => (
            <BaseField
            />
          ),
        ),
      baseGrouping,
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
      grouping,
      formValueSelector,
      // TODO: What to do with extraProps?
      ...extraProps
    } = this.props;
    const { baseFields, baseGrouping } = this.state;
    return (
      <LayoutComponent
      >
        {(grouping.length > 0) && (baseGrouping
          .map(
            (Grouping, i) => (
              <Grouping
                key={i}
                getValuesFor={(keys) => Map(
                  keys.reduce(
                    (obj, key) => (
                      {
                        ...obj,
                        [key]: formValueSelector(key),
                      }
                    ),
                    {},
                  ),
                )}
              />
            ),
          )
        )}
        {(grouping.length <= 0) && (baseFields)}
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
