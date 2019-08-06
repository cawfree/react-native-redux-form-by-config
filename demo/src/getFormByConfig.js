import React from 'react';
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
import DynamicFields from './components/DynamicFields';

import defaultTypes from './types';
import defaultValidation from './validation';

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
  return connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { withRef: false },
  )(
    reduxForm(
      {
        form,
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
