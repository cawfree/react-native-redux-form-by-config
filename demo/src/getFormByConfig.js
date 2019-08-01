import React from 'react';
import { View } from 'react-native';
import { reduxForm, getFormSyncErrors } from 'redux-form/immutable';
import { connect } from 'react-redux';

import ThemeProvider from './theme';
import DynamicFields from './components/DynamicFields';

import defaultTypes from './types';
import defaultValidation from './validation';

function getFieldsByConfig(
  form,
  config,
) {
  const mapStateToProps = (state, ownProps) => {
    return {
      config,
      formSyncErrors: getFormSyncErrors(form)(state),
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
    )(({ LayoutComponent, theme, types, validation, ...extraProps}) => (
      <ThemeProvider
        theme={theme}
      >
        <View
        >
          <DynamicFields
            LayoutComponent={LayoutComponent}
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
