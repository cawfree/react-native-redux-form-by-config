# react-native-redux-form-by-config
A simple way to generate [Redux Form](https://redux-form.com/8.2.0/) linked layouts using a high-level config object.

## 🚡 Overview
This small utility function can be used to construct forms backed by `redux-form` through the definition of a high-level configuration object. This helps generate forms that connect to your application state faster, without busying yourself with the boilerplate validation logic.

Please note that this is a work in progress! The library currently only supports text input via a `TextInput`, with a fairly limited set of configuration options. If you would like to add anything, *pull requests are more than welcome; they are encouraged!*

## 🚀 Getting Started
You can install either via [npm](https://www.npmjs.com/package/@cawfree/react-native-redux-form-by-config):
```
npm install --save react-native-redux-form-by-config
```
Or alternatively by using [yarn](https://www.npmjs.com/package/@cawfree/react-native-redux-form-by-config):
```
yarn add react-native-redux-form-by-config
```
Finally, ensure your application has been hooked up to `redux-form` in your master `reducer`. This will look something along the lines of:

```
import { combineReducers } from 'react-redux';
import { reducer as form } from 'redux-form/immutable';

const buildReducer = (...extraReducers) => combineReducers(
  {
    form,
    // XXX: ... plus some application-specific reducers
    ...extraReducers,
  },
);

export default buildReducer;

```

## ✍️ Usage
```javascript
import React from 'react';
import {
  Alert,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';

import getFormByConfig from 'react-native-redux-form-by-config';

const styles = StyleSheet.create(
  container: {
    flex: 1,
  },
  text: {
    backgroundColor: 'peachpuff',
  },
);

export default class App extends React.Component {
  state = {
    AuthFields: getFormByConfig(
      'auth',
      [
          {
            required: true,
            key: 'email',
            label: 'E-Mail Address',
            type: 'text',
            placeholder: 'E-Mail Address',
            textContentType: 'emailAddress',
          },
          {
            required: true,
            min: 6,
            max: 64,
            key: 'password',
            type: 'text',
            label: 'Password',
            placeholder: 'Password',
            textContentType: 'password',
            secureTextEntry: true,
          },
        ]
    ),
    // XXX: This is the submission invocation provided
    //      by redux-form.
    handleAuthSubmit: null,
  }
  constructor(nextProps) {
    super(nextProps);
    this.__onHandleAuthSubmit = this.__onHandleAuthSubmit.bind(this);
    this.__onAuth = this.__onAuth.bind(this);
  }
  __onHandleAuthSubmit(handleAuthSubmit) {
    this.setState(
      {
        handleAuthSubmit,
      },
    );
  }
  __onAuth() {
    const {
      handleAuthSubmit,
    } = this.state;
    if (handleAuthSubmit) {
      return new Promise(
        (resolve, reject) => handleAuthSubmit(resolve)().catch(reject),
      )
        .then((results) => {
          // XXX: Here are your validated results!
          const emailAddress = auth.get('email');
          const password = auth.get('password');
        });
    }
    return Promise.reject(
      new Error(
        'Unable to auth; submission method not found!',
      ),
    );
  }
  render() {
    const {
      AuthFields,
    } = this.state;
    return (
      <View
        style={styles.container}
      >
        <AuthFields
          onHandleSubmit={this.__onHandleAuthSubmit}
        />
        <TouchableOpacity
          onPress={this.__onAuth}
        >
          <Text
            style={styles.text}
          >
            {'Sign In'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
```

## ✌️ License
[MIT](https://opensource.org/licenses/MIT).
