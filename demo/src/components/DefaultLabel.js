import React from 'react';
import { Text } from 'react-native';

import { withTheme } from './../theme';

export default withTheme(
  ({ label, theme: { marginExtraShort, labelStyle }, ...extraProps }) => (
    <Text
      style={[
        labelStyle,
        {
          marginBottom: marginExtraShort,
        },
      ]}
      {...extraProps}
    >
      {label}
    </Text>
  ),
);
