import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
// TODO: Make this configurable at the invocation level.
import {
  Field,
} from 'redux-form/immutable';
import { reduxForm } from 'redux-form/immutable';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Collapsible from 'react-native-collapsible';

// TODO: Expose properties and rendering/animation interfaces, that kind of stuff.
const {
  width: screenWidth,
} = Dimensions.get('window');

const marginShort = 10;
const marginExtraShort = 5;

const styles = StyleSheet.create({
  error: {
    height: 25,
    color: '#FF0000FF',
  },
  textInput: {
    backgroundColor: 'white',
    height: 50,
    flex: 1,
    borderTopLeftRadius: marginExtraShort,
    borderBottomLeftRadius: marginExtraShort,
  },
  field: {

  },
});

const renderTextInput = config => ({ input: { onChange, value, ...restInput }, meta: { touched, error, ...restMeta}}) => {
  const {
    numberOfLines,
    placeholder,
    secureTextEntry,
    textContentType,
    collapsed,
    ref,
    style,
    ...restConfig
  } = config;
  const resolvedNumberOfLines = numberOfLines || 1;
  const resolvedStyle = style || {};
  const multiline = resolvedNumberOfLines > 1;
  const shouldShowError = (!!touched && !!error) || !collapsed;
  return (
    <View
    >
      <View
        style={{
          borderRadius: marginShort,
          overflow: 'hidden',
          backgroundColor: '#FFFFFFFF',
          flexDirection: 'row',
        }}
      >
        <TextInput
          ref={ref}
          style={{
            width: (screenWidth - 50) - (2 * marginShort),
            minHeight: 40,
            fontSize: 16,
            ...resolvedStyle,
          }}
          value={value}
          onChangeText={onChange}
          numberOfLines={resolvedNumberOfLines}
          multiline={multiline}
          placeholder={placeholder || ''}
          underlineColorAndroid="transparent"
          secureTextEntry={secureTextEntry}
          textContentType={textContentType}
        />
        <View
          style={{
            width: 50,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {(!!touched && !!error) && (
            <FontAwesomeIcon
              name="exclamation-triangle"
              size={17}
              color="lightgrey"
            />
          )}
        </View>
      </View>
      <Collapsible
        collapsed={!shouldShowError}
      >
        <View
          style={{
            width: screenWidth,
            height: 30,
            flexDirection: 'row',
          }}
        >
          {(!!touched && !!error) && (
            <View
              style={{
                width: screenWidth - (2 * marginShort),
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}
            >
              <Text
                style={styles.error}
              >
                {error}
              </Text>
            </View>
          )}
        </View>
      </Collapsible>
    </View>
  );
};

const isRequired = label => value => value ? undefined : `${label} is required.`;

const maxLength = (label, max) => value =>
    value && value.length > max ? `${label} must be ${max} characters or less.` : undefined;

const minLength = (label, min) => value =>
    value && value.length < min ? `${label} must be ${min} characters or more.` : undefined;

const isEmail = value =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
      'This E-Mail Address doesn\'t look right.' : undefined

const getValidationByConfig = (config) => {
  const {
    type,
    label,
    required,
  } = config;
  if (type === 'text') {
    const {
      min,
      max,
      textContentType,
    } = config;
    return ([
      required && isRequired(label),
      max && maxLength(label, max),
      min && minLength(label, min),
      textContentType === 'emailAddress' && isEmail,
    ])
      .filter((e) => (!!e));
  }
  return [];
};

const getComponentByConfig = (config) => {
  const {
    type,
  } = config;
  if (type === 'text') {
    return renderTextInput(
      config,
    );
  }
};

class DynamicFields extends React.Component {
  constructor(nextProps) {
    super(nextProps);
    const {
      config,
    } = nextProps;
    const cleanConfig = config
      .filter((e) => {
        const {
          key,
          label,
          // TODO: validate type
          type,
        } = e;
        // TODO: Enforce validation for supported types only!
        return key && type && label;
      });
    this.state = ({
      fields: cleanConfig.reduce(
          (arr, el, i) => {
            const {
              key,
              type,
              label,
            } = el;
            const resolvedLabel = (label || key);
            const validate = getValidationByConfig(
              el,
            );
            return ([
              ...arr,
              <Field
                name={key}
                component={getComponentByConfig(el)}
                validate={validate}
              />
            ]);
          },
          [],
        ),
    });
  }
  componentDidMount() {
    const {
      handleSubmit,
      onHandleSubmit,
    } = this.props;
    if (onHandleSubmit) {
      onHandleSubmit(handleSubmit);
    }
  }
  render() {
    const {
      fields,
      ...nextState
    } = this.state;
    return (
      <View
      >
        {fields}
      </View>
    );
  }
}

function getFieldsByConfig(
  form,
  config,
) {
  const mapStateToProps = (state, ownProps) => {
    return ({
      config,
    });
  };
  const mapDispatchToProps = (dispatch, ownProps) => {
    return ({

    });
  };
  return connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { withRef: false },
  )(
    reduxForm(
      {
        form,
      },
    )(DynamicFields),
  );
}

export default getFieldsByConfig;
