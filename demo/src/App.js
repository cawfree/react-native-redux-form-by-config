import React from 'react';
import {
  Platform,
  Alert,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { reducer as form } from 'redux-form/immutable';
import { defaultTheme } from './theme';
import Collapsible from '@cawfree/react-native-collapsible-view';

import getFormByConfig from './getFormByConfig';

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      paddingVertical: 5,
      paddingHorizontal: 5,
      backgroundColor: '#DDDDDD',
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

class App extends React.Component {
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
            // XXX: This is a reserved field for initializing the form state.
            //value: 'helloooo',
            // Non-configuration props are delegated directly to the <TextInput/>.
            placeholder: 'E-Mail Address Here',
            textContentType: 'emailAddress',
            value: 'hi',
            style: {
              fontSize: 20,
            },
          },
          {
            required: true,
            min: 6,
            max: 64,
            key: 'password',
            value: 'lol',
            type: 'text',
            label: 'Password',
            placeholder: 'Password',
            textContentType: 'password',
            secureTextEntry: true,
            style: {
              fontSize: 20,
            },
          },
          {
            required: true,
            min: 6,
            max: 64,
            key: 'notes',
            type: 'text',
            value: 'default notes',
            label: 'Notes',
            placeholder: 'Your notes here',
            numberOfLines: 3,
            style: {
              fontSize: 20,
              height: 300,
            },
          },
          {
            required: true,
            key: 'birthday',
            label: 'Birthday',
            type: 'date',
            // XXX: Must be moment-compatible.
            format: 'YYYY/MM/DD',
          },
          // TODO: Need to error on shared-level duplicate keys.
          {
            key: 'nested',
            forms: [
              {
                key: 'deeplyNested',
                label: 'hello',
                forms: [
                  {
                    required: true,
                    key: 'someVal',
                    label: 'Nested Example',
                    type: 'text',
                    value: 'some deeply initialized quantity',
                  },
                ],
              },
            ],
          },
        ],
        [
          // XXX: You can optionally specify groups. Any orphaned elements
          //      that are not referenced by a group will *not* be rendered.
          {
            keys: [
              'email',
              'password',
              'notes',
              'birthday',
              'nested.deeplyNested.someVal',
            ],
          },
        ],
    ),
    // XXX: Now supports booleans with hyperlinked descriptions!
    SignUpTermsFields: getFormByConfig(
        'signUpTerms',
        [
          {
            required: true,
            key: 'terms',
            type: 'boolean',
            value: true,
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
      showTerms: false,
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
          console.log(JSON.stringify(auth));
          //// XXX: Here are your validated results!
          //const emailAddress = auth.get('email');
          //const password = auth.get('password');
          console.log(auth);
          console.log(signUpTerms);
        })
        .catch(console.log);
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
      showTerms,
    } = this.state;
    return (
      <Provider
        store={store}
      >
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'purple',
          }}
        >
          <View
          >
            <View
              style={styles.container}
            >
              <AuthFields
                onHandleSubmit={this.__onHandleAuthSubmit}
                suppressLabels
              />
              <SignUpTermsFields
                onHandleSubmit={this.__onHandleSignUpTermsSubmit}
                theme={{
                  ...defaultTheme,
                }}
              />
            </View>
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
        </View>
      </Provider>
    );
  }
}

let hotWrapper = () => () => App;
if (Platform.OS === 'web') {
  const { hot } = require('react-hot-loader');
  hotWrapper = hot;
}
export default hotWrapper(module)(App);
