import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

const styles = StyleSheet
  .create(
    {
      container: {
        flex: 1,
        padding: 5,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: 'lightgrey',
      },
    },
  );

class DefaultGrouping extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <View
        style={styles.container}
      >
        {children}
      </View>
    );
  }
}

DefaultGrouping.propTypes = {
  children: PropTypes.arrayOf([]),
};

DefaultGrouping.defaultProps = {
  children: [],
};

const mapStateToProps = (state, ownProps) => {
  const {
    keys,
    formValueSelector,
  } = ownProps;
  // TODO: understand whether this is appropriate
  console.log(keys);
  console.log(formValueSelector(state, 'nestedArrayContents'));
  return {
    
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    withRef: false,
  },
)(DefaultGrouping);
