import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

import { withTheme, defaultTheme } from './../theme';

const DefaultLabel = ({ label, style, theme: { marginExtraShort, labelStyle }, ...extraProps }) => (
  <Text
    style={[
      style,
      {
        marginBottom: marginExtraShort,
      },
    ]}
    {...extraProps}
  >
    {label}
  </Text>
);

DefaultLabel.propTypes = {
  style: PropTypes.shape({}),
};

DefaultLabel.defaultProps = {
  style: defaultTheme.groupLabelStyle,
};

export default withTheme(
  DefaultLabel,
);
