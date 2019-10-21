import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/dist/FontAwesome';

const Chevron = ({ toggled, onRequestToggle, disabled, ...extraProps }) => (
  <TouchableOpacity
    onPress={onRequestToggle}
    disabled={disabled}
  >
    <FontAwesomeIcon
      name={!toggled ? 'chevron-down' : 'chevron-up'}
      {...extraProps}
    />
  </TouchableOpacity>
);

Chevron.propTypes = {
  ...FontAwesomeIcon.propTypes,
  onRequestToggle: PropTypes.func,
  toggled: PropTypes.bool,
  disabled: PropTypes.bool,
};

Chevron.defaultProps = {
  ...FontAwesomeIcon.defaultProps,
  onRequestToggle: () => null,
  toggled: false,
  disabled: false,
};

export default Chevron;
