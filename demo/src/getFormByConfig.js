import React from 'react';
import { Map } from 'immutable';
import { View } from 'react-native';
import {
  reduxForm,
  formValueSelector,
  //getFormValues,
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
import DynamicFields from './components/DynamicFields';

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
          forms,
          value,
        } = e;
        if (typeof key === 'string') {
          const isNested = (!type) && (forms);
          const isConfig = (!forms) && (type);
          if (isNested) {
            return {
              ...obj,
              [key]: accumulateInitialValues(
                forms,
              ),
            };
          } else if (isConfig) {
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
  grouping,
) {
  const mapStateToProps = (state, ownProps) => {
    return {
      ...ownProps,
      config,
      grouping,
      //getFormValues: () => getFormValues(form)(state),
      //getFormValues: () => state.form,
      formValueSelector: key => formValueSelector(form)(state, key),
      //values: formValues(form)(state),
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

    };
  };
  const initialValues = accumulateInitialValues(
    config,
  );
  console.log(initialValues);
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
      },
    )(({ GroupingComponent, LayoutComponent, theme, types, validation, ...extraProps}) => (
      <ThemeProvider
        theme={theme}
      >
        <View
        >
          <DynamicFields
            LayoutComponent={LayoutComponent}
            GroupingComponent={GroupingComponent}
            types={types || defaultTypes}
            validation={validation || defaultValidation}
            {...extraProps}
          />
        </View>
      </ThemeProvider>
    )),
  );
}

export default getFieldsByConfig;
