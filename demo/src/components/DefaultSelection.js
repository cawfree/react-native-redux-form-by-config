import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text } from 'react-native';

import { withTheme } from '../theme';

class DefaultSelection extends React.Component {
  render() {
    const { label, selection, theme, LabelComponent } = this.props;
    const { marginShort } = theme;
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <LabelComponent
          label={label}
        />
        
        {selection
          .map(({ label, children }) => (
            children
          ))}
      </View>
    );
  }
}

DefaultSelection.propTypes = {
  selection: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
};

DefaultSelection.defaultProps = {
  selection: [],
};

export default withTheme(
  DefaultSelection,
);
