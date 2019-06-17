import { connect } from 'react-redux';

import TextInputField from './../components/TextInputField';

const {
  withTheme,
} = require('./../theme');

const mapStateToProps = (state, ownProps) => {
  return {

  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {

  };
};

export default withTheme(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {
      withRef: false,
    },
  )(TextInputField),
);
