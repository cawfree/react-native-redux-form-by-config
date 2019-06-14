import { connect } from 'react-redux';
import { withTheme } from './../theme';

import Wrapper from './../components/Wrapper';

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
  )(Wrapper),
);
