import React from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';
import { isEqual } from 'lodash';

import FieldContainer from './FieldContainer';
import CheckBoxField from './CheckBoxField';
import TextInputField from './TextInputField';

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
    return TextInputField;
  } else if (type === 'boolean') {
    return CheckBoxField;
  }
  throw new Error(
    `Unrecognized field type "${type}".`,
  );
};

class DynamicFields extends React.Component {
  constructor(nextProps) {
    super(nextProps);
    const {
      renderFieldError,
      linkStyle,
      config,
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
                name={key}
                component={(extraProps) => {
                  const {
                    meta: {
                      touched,
                      error,
                    },
                  } = extraProps;
                  // TODO@ to style
                  return (
                    <FieldContainer
                      collapsed={collapsed}
                      backgroundColor={type === 'boolean' ? 'transparent' : '#FFFFFFFF'}
                      touched={touched}
                      error={error}
                      renderFieldError={renderFieldError}
                    >
                      <FieldImpl
                        {...extraProps}
                        config={restConfig}
                      />
                    </FieldContainer>
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

export default DynamicFields;
