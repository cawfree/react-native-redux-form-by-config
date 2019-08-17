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
import DefaultLabel from './DefaultLabel';

const styles = StyleSheet
  .create(
    {
      defaultLayout: {
        flex: 1,
        flexDirection: 'column',
      },
    },
  );

export const isNested = (config = {}) => {
  const { type, forms } = config;
  return (!type) && forms;
};

// XXX: A specialized yt
export const isGrouping = (config = {}) => {
  if (isNested(config)) {
    const { key } = config;
    return !key;
  }
  return false;
};

export const isField = (config = {}) => {
  const { key } = config;
  // XXX: These *do* need a type attribute, but in the interest
  //      of failing safely, missing specifications will return
  //      with a warning.
  return !isNested(config) && !!key;
};

export const isConfig = (config = {}) => {
  return isField(config) || isNested(config);
};

// Transforms the config into a single dimension list of config elements.
// Some config options can be nested forms, we use this to extrapolate 
// the nested quantities as a linear declaration.
//function vectorizeConfig(config = [], keyPfx = '') {
//  return config
//    .reduce(
//      (arr, config = {}) => {
//        const {
//          key,
//          type,
//          forms,
//        } = config;
//        const nested = isNested(config);
//        const grouping = isGrouping(config);
//        if (key || nested) {
//          const field = isField(config);
//          if (nested) {
//            const { label } = config;
//            // XXX: Elements are considered non-related and part of a group
//            //      if they don't have an owning title.
//            const subPfx = grouping ? keyPfx : `${keyPfx}${key}.`;
//            return [
//              ...arr,
//              // XXX: Generate a dynamic label for the group.
//              //(!!label) && (
//              //  {
//              //    key: uuidv4(),
//              //    type: 'label',
//              //    label,
//              //  }
//              //),
//              ...vectorizeConfig(
//                forms,
//                subPfx,
//              ),
//            ]
//              .filter(e => !!e);
//          } else if (field) {
//            return [
//              ...arr,
//              {
//                ...config,
//                key: `${keyPfx}${key}`,
//              },
//            ];
//          }
//        }
//        throw new Error(
//          `Encountered erroneous form element:\n ${JSON.stringify(config)}`,
//        );
//      },
//      [],
//    );
//}

function evaluateToJsx (
  config = [],
  theme = {},
  FieldWrapper = DefaultFieldWrapper,
  GroupingComponent,
  LabelComponent,
  validation = {},
  types = {},
  keyPfx = '',
) {
  return config
    .reduce(
      (children, e) => {
        const nested = isNested(e);
        const field = isField(e);
        if (nested) {
          const { forms } = e;
          const grouping = isGrouping(e);
          if (grouping) {
            // TODO: Missing index (position of group) and getValuesFor
            return [
              ...children,
              <GroupingComponent
                {...e}
              >
                {evaluateToJsx(
                  forms,
                  theme,
                  FieldWrapper,
                  GroupingComponent,
                  LabelComponent,
                  validation,
                  types,
                  keyPfx,
                )}
              </GroupingComponent>
            ];
          }
          const { key, label } = e;
          return [
            ...children,
            (!!label) && (
              <LabelComponent
                label={label}
              />
            ),
            ...evaluateToJsx(
              forms,
              theme,
              FieldWrapper,
              GroupingComponent,
              LabelComponent,
              validation,
              types,
              `${keyPfx}${key}.`,
            ),
          ]
            .filter(e => !!e);
        }
        // XXX: It must be a field.
        const {
          value,
          ...safeConfig
        } = e;
        const { key, type } = e;
        const validate = (validation[type] || (() => []))(e);
        const FieldImpl = types[type];
        const sfx = `${keyPfx}${key}`;
        if (!FieldImpl) {
          console.warn(
            `Unrecognized field type ${type}!`,
          );
          return children;
        }
        return [
          ...children,
          <Field
            key={sfx}
            name={sfx}
            component={({ meta, ...extraProps }) => (
              <FieldWrapper
                {...extraProps}
                meta={meta}
                theme={theme}
                config={safeConfig}
              >
                {FieldImpl}
              </FieldWrapper>
            )}
            validate={validate}
          />,
        ];
      },
      [],
    );
};

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
      LayoutComponent,
      GroupingComponent,
      LabelComponent,
      formValueSelector,
      getFormValues,
    } = nextProps;
    const children = evaluateToJsx(
      config,
      theme,
      FieldWrapper,
      GroupingComponent,
      LabelComponent,
      validation,
      types,
    );
    this.state = {
      children,
    };
//    //const cleanConfig = vectorizeConfig(
//    //  config,
//    //)
//    //  .filter((e) => {
//    //    const {
//    //      key,
//    //      label,
//    //      type,
//    //    } = e;
//    //    return key && type && label;
//    //  });
//    const baseFields = cleanConfig.reduce(
//      (arr, el, i) => {
//        const {
//          type,
//          key,
//          label,
//          ...restConfig
//        } = el;
//        // XXX: These are safe properties we wish to be able to delegate to field instances.
//        const {
//          // XXX: Initial values would already have been processed by this point.
//          value,
//          fields,
//          ...safeProps
//        } = el;
//        const resolvedLabel = (label || key);
//        const validate = (validation[type] || (() => []))(el);
//        const FieldImpl = types[type];
//        const isLabel = (type === 'label');
//        if (!FieldImpl && !isLabel) {
//          console.warn(
//            `Missing implementation of data type "${type}"!`,
//          );
//        }
//        const EvaluateAsField = ({ ...nextProps}) => (
//          <Field
//            key={key}
//            name={key}
//            component={({ meta, ...extraProps }) => (
//              <FieldWrapper
//                {...nextProps}
//                {...extraProps}
//                meta={meta}
//                theme={theme}
//                config={safeProps}
//                suppressLabels={suppressLabels}
//              >
//                {FieldImpl}
//              </FieldWrapper>
//            )}
//            validate={validate}
//          />
//        );
//        const Label = ({ ...extraProps }) => (
//          <Text
//            style={{
//              width: 1000,
//              height: 1000,
//              backgroundColor: 'green',
//            }}
//          >
//            {'yoyoyoyoyoyoyoo'}
//          </Text>
//        );
//        // TODO: label handling...
//        return ([
//          ...arr,
//          (!isLabel) && EvaluateAsField,
//          (!!isLabel) && Label,
//        ])
//          .filter(e => !!e);
//      },
//      [],
//    ); 
//    //const baseGrouping = [];
//    //const baseGrouping = grouping
//    //  .map(
//    //    (config, index) => {
//    //      const { keys } = config;
//    //      return ({ getValuesFor, ...extraProps }) => (
//    //        <GroupingComponent
//    //          {...config}
//    //          index={index}
//    //          values={getValuesFor(keys)}
//    //        >
//    //          {keys
//    //            .map(
//    //              key => baseFields[cleanConfig.map(({ key }) => key).indexOf(key)],
//    //            )}
//    //        </GroupingComponent>
//    //      );
//    //    },
//    //  );
//    this.state = ({
//      baseFields: baseFields
//        .map(
//          BaseField => (
//            <BaseField
//            />
//          ),
//        ),
//      //baseGrouping,
//    });
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
    const { children } = this.state;
    //const { baseFields } = this.state;
    return (
      <LayoutComponent
        {...extraProps}
      >
        {children}
      </LayoutComponent>
    );
  }
}

//{(baseGrouping.length > 0) && (baseGrouping
//          .map(
//            (Grouping, i) => (
//              <Grouping
//                key={i}
//                getValuesFor={(keys) => Map(
//                  keys.reduce(
//                    (obj, key) => (
//                      {
//                        ...obj,
//                        [key]: formValueSelector(key),
//                      }
//                    ),
//                    {},
//                  ),
//                )}
//              />
//            ),
//          )
//        )}
//        {(baseGrouping.length <= 0) && (baseFields)}

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
  LabelComponent: DefaultLabel,
};

export default withTheme(
  DynamicFields,
);
