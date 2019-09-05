import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import ProgressIndicator from './ProgressIndicator';

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
    const {
      children,
      numberOfValues,
      values,
    } = this.props;
    const numberSubmitted = values.filter(e => !!e).length;
    return (
      <View
      >
        <View
          style={{
            flexDirection: 'row',
            height: 10,
          }}
        >
          <ProgressIndicator
            value={numberSubmitted}
            minValue={0}
            maxValue={numberOfValues}
          />
        </View>
        <View
          style={styles.container}
        >
          <Text
            children={`${numberSubmitted}/${numberOfValues}`}
          />
          {children}
        </View>
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
    getDescendents,
    formValueSelector,
  } = ownProps;
  const descendents = getDescendents();
  return {
    numberOfValues: descendents
      .length,
    values: descendents
      .map(
        key => formValueSelector(state, key),
      ),
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
