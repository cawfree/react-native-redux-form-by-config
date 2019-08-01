import React from 'react';
import { reduxForm, getFormSyncErrors } from 'redux-form/immutable';
import { connect } from 'react-redux';

import ThemeProvider from './theme';
import DynamicFields from './components/DynamicFields';

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
    )(({ theme, ...extraProps}) => (
      <ThemeProvider
        theme={theme}
      >
        <DynamicFields
          {...extraProps}
        />
      </ThemeProvider>
    )),
  );
}

export default getFieldsByConfig;
