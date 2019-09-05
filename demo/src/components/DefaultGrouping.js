import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  View,
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
      label,
      LabelComponent,
    } = this.props;
    // TODO: extrac tthis logic
    const hasLabel = (typeof label === 'string') && (label.length > 0);
    // TODO: This needs to match validation rules.
    const numberSubmitted = values.filter(e => !!e).length;
    return (
      <View
      >
        {(!!hasLabel) && (
          <LabelComponent
            label={(`${label} (${numberSubmitted}/${numberOfValues})`)}
          />
        )}
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
