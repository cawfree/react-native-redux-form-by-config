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

import { withTheme } from '../theme';

import DefaultFieldWrapper from './DefaultFieldWrapper';
import DefaultGrouping from './DefaultGrouping';
import DefaultLabel from './DefaultLabel';
import DefaultSelection from './DefaultSelection';

import defaultTransform from '../transform';

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
    return key === undefined;
  }
  return false;
};

export const isSelection = (config = {}) => {
  if (isGrouping(config)) {
    const { forms } = config;
    if (Array.isArray(forms) && forms.length > 1) {
      return forms
        .reduce(
          (r, e) => (
            r && isGrouping(e)
          ),
          true,
        );
    }
  }
  return false;
};

export const isField = (config = {}) => {
  const { key } = config;
  // XXX: These *do* need a type attribute, but in the interest
  //      of failing safely, missing specifications will return
  //      with a warning.
  return !isNested(config) && key !== undefined;
};

export const isConfig = (config = {}) => {
  return isField(config) || isNested(config);
};

// XXX: Returns the keys of nested forms within the config that are capable of supplying
//      a value. 
export const getDescendents = (config = [], directOnly = false, keyPfx = '') => {
  return config
    .reduce(
      (keys, e) => {
        const nested = isNested(e);
        const field = isField(e);
        if (nested) {
          const { forms } = e;
          const grouping = isGrouping(e);
          if (grouping) {
            return [
              ...keys,
              ...(
                (!directOnly) ? (
                  getDescendents(
                    forms,
                    directOnly,
                    keyPfx,
                  )
                ) : (
                  []
                )
              ),
            ];
          }
          const { key } = e;
          return [
            ...keys,
            ...getDescendents(
              forms,
              directOnly,
              `${keyPfx}${key}.`,
            ),
          ];
        }
        const { key } = e;
        return [
          ...keys,
          `${keyPfx}${key}`,
        ];
      },
      [],
    );
};

function evaluateToJsx (
  config = [],
  theme = {},
  FieldWrapper = DefaultFieldWrapper,
  GroupingComponent,
  SelectionComponent,
  LabelComponent,
  validation = {},
  types = {},
  formValueSelector,
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
            const selection = isSelection(e); 
            if (selection) {
              const selection = forms
                .map(
                  ({ label, forms }) => (
                    {
                      label,
                      children: evaluateToJsx(
                        forms,
                        theme,
                        FieldWrapper,
                        GroupingComponent,
                        SelectionComponent,
                        LabelComponent,
                        validation,
                        types,
                        formValueSelector,
                        keyPfx,
                      ),
                    }
                  ),
                );
              return [
                ...children,
                <SelectionComponent
                  {...e}
                  LabelComponent={LabelComponent}
                  selection={selection}
                />,
              ];
            }
            // TODO: Missing index (position of group) and getValuesFor
            // XXX: must be scoped
            return [
              ...children,
              <GroupingComponent
                LabelComponent={LabelComponent}
                getDescendents={() => getDescendents(forms, true, keyPfx)}
                formValueSelector={formValueSelector}
                {...e}
              >
                {evaluateToJsx(
                  forms,
                  theme,
                  FieldWrapper,
                  GroupingComponent,
                  SelectionComponent,
                  LabelComponent,
                  validation,
                  types,
                  formValueSelector,
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
              SelectionComponent,
              LabelComponent,
              validation,
              types,
              formValueSelector,
              `${keyPfx}${key}.`,
            ),
          ]
            .filter(e => !!e);
        }
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
      SelectionComponent,
      LabelComponent,
      formValueSelector,
      getFormValues,
    } = nextProps;
    const children = evaluateToJsx(
      config,
      theme,
      FieldWrapper,
      GroupingComponent,
      SelectionComponent,
      LabelComponent,
      validation,
      types,
      formValueSelector,
    );
    this.state = {
      children,
    };
  }
  componentDidMount() {
    const {
      handleSubmit,
      onHandleSubmit,
      transform,
    } = this.props;
    if (onHandleSubmit) {
      onHandleSubmit(
        () => Promise
          .resolve()
          .then(
            () => new Promise((resolve, reject) => handleSubmit(resolve)().catch(reject)),
          )
          .catch(
            e => Promise
              .reject(
                new Error(
                  'Form did not satisfy validation',
                ),
              ),
          )
          .then(transform),
      );
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
      ...extraProps
    } = this.props;
    const { children } = this.state;
    return (
      <LayoutComponent
        {...extraProps}
      >
        {children}
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
  SelectionComponent: PropTypes.elementType,
  grouping: PropTypes.arrayOf(
    PropTypes.shape(
      {
        keys: PropTypes.arrayOf(
          PropTypes.string,
        ),
      },
    ),
  ),
  transform: PropTypes.func,
};

DynamicFields.defaultProps = {
  theme: undefined,
  disabled: false,
  LayoutComponent: ({ children }) => (
    <View
    >
      {children}
    </View>
  ),
  FieldWrapper: DefaultFieldWrapper,
  GroupingComponent: DefaultGrouping,
  SelectionComponent: DefaultSelection,
  grouping: [],
  LabelComponent: DefaultLabel,
  transform: defaultTransform,
};

export default withTheme(
  DynamicFields,
);
