import React from 'react';
import { Map } from 'immutable';
import { View } from 'react-native';
import {
  reduxForm,
  formValueSelector,
  getFormInitialValues,
  getFormSyncErrors,
  getFormMeta,
  getFormAsyncErrors,
  getFormSyncWarnings,
  getFormSubmitErrors,
  getFormError,
  getFormNames,
  isDirty,
  isPristine,
  isValid,
  isInvalid,
  isSubmitting,
  hasSubmitSucceeded,
  hasSubmitFailed
} from 'redux-form/immutable';
import { connect } from 'react-redux';

import ThemeProvider from './theme';
import DynamicFields, {
  isConfig,
  isNested,
  isGrouping,
  isField,
}  from './components/DynamicFields';

import defaultTypes from './types';
import defaultValidation from './validation';

// TODO: This has a tight relationship with vectorizeConfig.
//       Should increase coupling.
function accumulateInitialValues(config = []) {
  return config
    .reduce(
      (obj, e = {}) => {
        const {
          key,
          type,
          value,
        } = e;
        if (isConfig(e)) {
          const { forms } = e;
          const nested = isNested(e);
          const field = isField(e);
          if (nested) {
            const grouping = isGrouping(e);
            if (grouping) {
              return {
                ...obj,
                ...accumulateInitialValues(
                  forms,
                ),
              };
            }
            // XXX: Keys are required attributes for nested fields
            //      that are not a grouping.
            if (!!key) {
              return {
                ...obj,
                [key]: accumulateInitialValues(
                  forms,
                ),
              };
            }
          } else if (field) {
            return {
              ...obj,
              [key]: value,
            };
          }
        }
        throw new Error(
          `Encountered malformed config object:\n${JSON.stringify(
            e,
          )}`,
        );
      },
      {},
    );
}

function getFieldsByConfig(
  form,
  config,
) {
  const mapStateToProps = (state, ownProps) => {
    return {
      ...ownProps,
      config,
      initialValues: getFormInitialValues(form)(state),
      formSyncErrors: getFormSyncErrors(form)(state),
      fields: getFormMeta(form)(state),
      formAsyncErrors: getFormAsyncErrors(form)(state),
      syncWarnings: getFormSyncWarnings(form)(state),
      submitErrors: getFormSubmitErrors(form)(state),
      formError: getFormError(form)(state),
      names: getFormNames()(state),
      dirty: isDirty(form)(state),
      pristine: isPristine(form)(state),
      valid: isValid(form)(state),
      invalid: isInvalid(form)(state),
      submitting: isSubmitting(form)(state),
      submitSucceeded: hasSubmitSucceeded(form)(state),
      submitFailed: hasSubmitFailed(form)(state)
    };
  };
  const mapDispatchToProps = (dispatch, ownProps) => {
    return {
      formValueSelector: (state, key) => formValueSelector(form)(state, key),
    };
  };
  const initialValues = accumulateInitialValues(
    config,
  );
  return connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { withRef: false },
  )(
    reduxForm(
      {
        form,
        initialValues: accumulateInitialValues(
          config,
        ),
        touchOnChange: true,
        touchOnBlur: true,
        onSubmit: (...args) => args,
      },
    )(({ GroupingComponent, LayoutComponent, theme, types, validation, ...extraProps}) => (
      <ThemeProvider
        theme={theme}
      >
        <DynamicFields
          LayoutComponent={LayoutComponent}
          GroupingComponent={GroupingComponent}
          types={types || defaultTypes}
          validation={validation || defaultValidation}
          {...extraProps}
        />
      </ThemeProvider>
    )),
  );
}

export default getFieldsByConfig;
