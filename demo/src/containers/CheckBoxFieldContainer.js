import { connect } from 'react-redux';

import CheckBoxField from './../components/CheckBoxField';

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
  )(CheckBoxField),
);
