import { connect } from 'react-redux';

import { withTheme } from './../theme';

import TextInputField from './../components/TextInputField';

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
