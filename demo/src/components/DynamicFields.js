import React from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';
import { isEqual } from 'lodash';

import { withTheme } from './../theme';

import WrapperContainer from './../containers/WrapperContainer';
import CheckBoxFieldContainer from './../containers/CheckBoxFieldContainer';
import TextInputFieldContainer from './../containers/TextInputFieldContainer';

// TODO: to known package library
const isRequired = label => value => value ? undefined : `${label} is required.`;

const maxLength = (label, max) => value =>
    value && value.length > max ? `${label} must be ${max} characters or less.` : undefined;

const minLength = (label, min) => value =>
    value && value.length < min ? `${label} must be ${min} characters or more.` : undefined;

const isEmail = value =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
      'This E-Mail Address doesn\'t look right.' : undefined

const getValidationByConfig = (config) => {
  const {
    type,
    label,
    required,
  } = config;
  if (type === 'text') {
    const {
      min,
      max,
      textContentType,
    } = config;
    return ([
      required && isRequired(label),
      max && maxLength(label, max),
      min && minLength(label, min),
      textContentType === 'emailAddress' && isEmail,
    ])
      .filter(e => !!e);
  } else if (type === 'boolean') {
    return [
      required && isRequired(label),
    ]
      .filter(e => !!e);
  }
  return [];
};

// TODO: by type
const getComponentByConfig = (config) => {
  const {
    type,
  } = config;
  if (type === 'text') {
    return TextInputFieldContainer;
  } else if (type === 'boolean') {
    return CheckBoxFieldContainer;
  }
  throw new Error(
    `Unrecognized field type "${type}".`,
  );
};

class DynamicFields extends React.Component {
  constructor(nextProps) {
    super(nextProps);
    const {
      config,
      disabled,
      renderFieldError,
    } = nextProps;
    const cleanConfig = config
      .filter((e) => {
        const {
          key,
          label,
          // TODO: validate type
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
            } = el;
            const resolvedLabel = (label || key);
            const validate = getValidationByConfig(
              el,
            );
            const FieldImpl = getComponentByConfig(el);
            const {
              collapsed,
              ...restConfig
            } = el;
            return ([
              ...arr,
              <Field
                key={key}
                name={key}
                component={({ ...extraProps }) => {
                  const {
                    meta: {
                      touched,
                      error,
                    },
                  } = extraProps;
                  return (
                    <WrapperContainer
                      renderFieldError={renderFieldError}
                      type={type}
                      collapsed={collapsed}
                      touched={touched}
                      error={error}
                    >
                      <FieldImpl
                        {...extraProps}
                        disabled={disabled}
                        config={restConfig}
                      />
                    </WrapperContainer>
                  );
                }}
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
      theme,
      ...extraProps
    } = this.props;
    const {
      fields,
      ...nextState
    } = this.state;
    return (
      <View
      >
        {fields}
      </View>
    );
  }
}

DynamicFields.propTypes = {
  theme: PropTypes.shape({}),
  disabled: PropTypes.bool,
  renderFieldError: PropTypes.func,
};

DynamicFields.defaultProps = {
  theme: undefined,
  disabled: false,
  renderFieldError: undefined,
};

export default withTheme(
  DynamicFields,
);
