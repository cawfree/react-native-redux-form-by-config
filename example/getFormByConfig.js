import React from 'react';
// TODO: Make this configurable at the invocation level.
import {
  reduxForm,
  getFormSyncErrors,
} from 'redux-form/immutable';
import { connect } from 'react-redux';

import DynamicFields from './components/DynamicFields';

function getFieldsByConfig(
  form,
  config,
) {
  const mapStateToProps = (state, ownProps) => {
    return ({
      config,
      formSyncErrors: getFormSyncErrors(form)(state),
    });
  };
  const mapDispatchToProps = (dispatch, ownProps) => {
    return ({

    });
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
    )(DynamicFields),
  );
}

export default getFieldsByConfig;
