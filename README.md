# react-native-redux-form-by-config
A simple way to generate [Redux Form](https://redux-form.com/8.2.0/) linked layouts using a high-level config object.

## 🚡 Overview
This small utility function can be used to construct forms backed by `redux-form` through the definition of a high-level configuration object. This helps generate forms that connect to your application state faster, without busying yourself with the boilerplate validation logic.

Please note that this is a work in progress! The library currently only supports text input via a `TextInput` and `CheckBox`, with a fairly limited set of configuration options. If you would like to add anything, *pull requests are more than welcome; they are encouraged!*

## 🚀 Getting Started
You can install either via [npm](https://www.npmjs.com/package/@cawfree/react-native-redux-form-by-config):
```
npm install --save @cawfree/react-native-redux-form-by-config
```
Or alternatively by using [yarn](https://www.npmjs.com/package/@cawfree/react-native-redux-form-by-config):
```
yarn add @cawfree/react-native-redux-form-by-config
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
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { reducer as form } from 'redux-form/immutable';

import getFormByConfig from './getFormByConfig';

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      backgroundColor: 'lightgrey',
      paddingHorizontal: 5,
    },
    text: {
      backgroundColor: 'peachpuff',
    },
  },
);

const store = createStore(
  combineReducers(
    {
      form,
    },
  ),
  undefined,
);

export default class App extends React.Component {
  constructor(nextProps) {
    super(nextProps);
    this.state = {
      AuthFields: getFormByConfig(
        'auth',
        [
          {
            required: true,
            key: 'email',
            label: 'E-Mail Address',
            type: 'text',
            // Non-configuration props are delegated directly to the <TextInput/>.
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
    // XXX: Now supports booleans with hyperlinked descriptions!
    SignUpTermsFields: getFormByConfig(
        'signUpTerms',
        [
          {
            required: true,
            key: 'terms',
            type: 'boolean',
            label: 'Your acceptance',
            description: [
              `I accept the http://www.cawfree.com/mapsy/eula/ and promise to be awesome to other users.`,
              'end user license agreement',
            ],
            style: {
              textAlign: 'justify',
              color: '#FFFFFFCC',
            },
            color: '#FFFFFFFF',
          }
        ],
      ),
      // XXX: This is the submission invocation provided
      //      by redux-form.
      handleAuthSubmit: null,
      handleSignUpTermsSubmit: null,
    };
    this.__onHandleAuthSubmit = this.__onHandleAuthSubmit.bind(this);
    this.__onHandleSignUpTermsSubmit = this.__onHandleSignUpTermsSubmit.bind(this);
    this.__onAuth = this.__onAuth.bind(this);
  }
  __onHandleAuthSubmit(handleAuthSubmit) {
    this.setState(
      {
        handleAuthSubmit,
      },
    );
  }
  __onHandleSignUpTermsSubmit(handleSignUpTermsSubmit) {
    this.setState(
      {
        handleSignUpTermsSubmit,
      },
    );
  }
  __onAuth() {
    const {
      handleAuthSubmit,
      handleSignUpTermsSubmit,
    } = this.state;
    if (handleAuthSubmit) {
      return Promise.all(
        [
          new Promise(
            (resolve, reject) => handleAuthSubmit(resolve)(),
          ),
          new Promise(
            (resolve, reject) => handleSignUpTermsSubmit(resolve)(),
          ),
        ],
      )
        .then(([ auth, signUpTerms ]) => {
          //// XXX: Here are your validated results!
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
      SignUpTermsFields,
    } = this.state;
    return (
      <Provider
        store={store}
      >
        <View
          style={styles.container}
        >
          <AuthFields
            onHandleSubmit={this.__onHandleAuthSubmit}
          />
          <SignUpTermsFields
            onHandleSubmit={this.__onHandleSignUpTermsSubmit}
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
      </Provider>
    );
  }
}
```

## ✌️ License
[MIT](https://opensource.org/licenses/MIT).
