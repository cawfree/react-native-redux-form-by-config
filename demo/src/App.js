import React from 'react';
import {
  Platform,
  Alert,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { reducer as form } from 'redux-form/immutable';
import Collapsible from '@cawfree/react-native-collapsible-view';
import { defaultTheme } from './theme';

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
          {
            required: true,
            min: 6,
            max: 64,
            key: 'notes',
            type: 'text',
            label: 'Notes',
            placeholder: 'Your notes here',
            numberOfLines: 3,
            style: {
              fontSize: 20,
              height: 300,
            },
          }
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
      showTerms: false,
    };
    this.__onHandleAuthSubmit = this.__onHandleAuthSubmit.bind(this);
    this.__onHandleSignUpTermsSubmit = this.__onHandleSignUpTermsSubmit.bind(this);
    this.__onAuth = this.__onAuth.bind(this);
    this.__expand = this.__expand.bind(this);
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
        })
        .catch(console.log);
    }
    return Promise.reject(
      new Error(
        'Unable to auth; submission method not found!',
      ),
    );
  }
  __expand() {
    this.setState(
      {
        showTerms: !this.state.showTerms,
      },
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
          style={styles.container}
        >
          <Collapsible
            collapsed={!showTerms}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <AuthFields
                onHandleSubmit={this.__onHandleAuthSubmit}
              />
              <SignUpTermsFields
                onHandleSubmit={this.__onHandleSignUpTermsSubmit}
                theme={{
                  ...defaultTheme,
                  errorMessageStyle: {
                    fontWeight: 'bold',
                    color: 'green',
                  },
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
          </Collapsible>
          <TouchableOpacity
            onPress={this.__expand}
          >
            <Text
              style={styles.text}
            >
              {'Expand'}
            </Text>
          </TouchableOpacity>
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
