import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import Chevron from './Chevron';
import Collapsible from '@cawfree/react-native-collapsible-view';

import ProgressIndicator from './ProgressIndicator';
import { withTheme } from '../theme';

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
  constructor(props) {
    super(props);
    const { collapsed, collapsible } = props;
    this.state = {
      collapsed: !!(collapsed && collapsible),
    };
  }
  render() {
    const {
      theme,
      children,
      numberOfValues,
      values,
      label,
      LabelComponent,
      collapsible,
      collapsed,
      showProgress,
    } = this.props;
    const { collapsed: isCollapsed } = this.state;
    const {
      marginExtraShort,
      marginShort,
      labelStyle,
    } = theme;
    const hasLabel = (typeof label === 'string') && (label.length > 0);
    const numberSubmitted = values.filter(e => !!e).length;
    return (
      <View
        style={{
          padding: marginShort,
        }}
      >
        <View
          style={{
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {(!!hasLabel) && (
              <View
                style={{
                  flex: 1,
                }}
              >
                <LabelComponent
                  label={(`${label} (${numberSubmitted}/${numberOfValues})`)}
                />
              </View>
            )}
            {(!!collapsible) && (
              <View
                style={{
                  marginLeft: marginShort,
                }}
              >
                <Chevron
                  toggled={!isCollapsed}
                  color={labelStyle.color}
                  size={20}
                  onRequestToggle={() => this.setState(
                    {
                      collapsed: !isCollapsed,
                    },
                  )}
                />
              </View>
            )}
          </View>
          {(!!showProgress) && (
            <View
              style={{
                flex: 0,
                marginBottom: marginShort,
                opacity: 0.6,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  height: marginExtraShort,
                }}
              >
                <ProgressIndicator
                  value={numberSubmitted}
                  minValue={0}
                  maxValue={numberOfValues}
                />
              </View>
            </View>
          )} 
          <Collapsible
            collapsed={isCollapsed}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              {children}
            </View>
          </Collapsible>
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
)(withTheme(DefaultGrouping));
