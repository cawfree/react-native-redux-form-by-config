import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { Map } from 'immutable';
import { Field } from 'redux-form/immutable';
import { isEqual } from 'lodash';
import uuidv4 from 'uuid/v4';

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

// Transforms the config into a single dimension list of config elements.
// Some config options can be nested forms, we use this to extrapolate 
// the nested quantities as a linear declaration.
function vectorizeConfig(config = [], grouping = [], keyPfx = '') {
  return config
    .reduce(
      (arr, config = {}) => {
        const {
          key,
          type,
          forms,
        } = config;
        // XXX: key is a required attribute.
        if (!!key) {
          const isNested = (!type) && (forms);
          const isConfig = (!forms) && (type);
          if (isNested) {
            const { label } = config;
            return [
              ...arr,
              // XXX: Generate a dynamic label for the group.
              (!!label) && (
                {
                  key: uuidv4(),
                  type: 'label',
                  label,
                }
              ),
              ...vectorizeConfig(
                forms,
                grouping,
                `${keyPfx}${key}.`,
              ),
            ]
              .filter(e => !!e);
          } else if (isConfig) {
            return [
              ...arr,
              {
                ...config,
                key: `${keyPfx}${key}`,
              },
            ];
          }
        }
        throw new Error(
          `Encountered erroneous form element:\n ${JSON.stringify(config)}`,
        );
      },
      [],
    );
}

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
      suppressLabels,
    } = nextProps;
    const cleanConfig = vectorizeConfig(
      config,
      grouping,
    )
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
          type,
          key,
          label,
          ...restConfig
        } = el;
        // XXX: These are safe properties we wish to be able to delegate to field instances.
        const {
          // XXX: Initial values would already have been processed by this point.
          value,
          fields,
          ...safeProps
        } = el;
        const resolvedLabel = (label || key);
        const validate = (validation[type] || (() => []))(el);
        const FieldImpl = types[type];
        const isLabel = (type === 'label');
        if (!FieldImpl && !isLabel) {
          console.warn(
            `Missing implementation of data type "${type}"!`,
          );
        }
        const EvaluateAsField = ({ ...nextProps}) => (
          <Field
            key={key}
            name={key}
            component={({ meta, ...extraProps }) => (
              <FieldWrapper
                {...nextProps}
                {...extraProps}
                meta={meta}
                theme={theme}
                config={safeProps}
                suppressLabels={suppressLabels}
              >
                {FieldImpl}
              </FieldWrapper>
            )}
            validate={validate}
          />
        );
        const Label = ({ ...extraProps }) => (
          <Text
            style={{
              width: 1000,
              height: 1000,
              backgroundColor: 'green',
            }}
          >
            {'yoyoyoyoyoyoyoo'}
          </Text>
        );
        // TODO: label handling...
        return ([
          ...arr,
          (!isLabel) && EvaluateAsField,
          (!!isLabel) && Label,
        ])
          .filter(e => !!e);
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
      formValueSelector,
      // TODO: What to do with extraProps?
      ...extraProps
    } = this.props;
    const { baseFields, baseGrouping } = this.state;
    return (
      <LayoutComponent
      >
        {(baseGrouping.length > 0) && (baseGrouping
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
        {(baseGrouping.length <= 0) && (baseFields)}
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
