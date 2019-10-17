import React from 'react';
import {
  Platform,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { reducer as form } from 'redux-form/immutable';
import { defaultTheme } from './theme';

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
            label: 'yo',
            forms: [
              {
                label: 'some-test',
                type: 'text',
                key: 'hello',
              },
            ],
          }, 
          {
            label: 'This is another label',
            forms: [ 
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
                value: 'hi@hi.com',
                style: {
                  fontSize: 20,
                },
              },
              {
                required: true,
                min: 6,
                max: 64,
                key: 'password',
                value: 'lololol',
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
                //required: true,
                key: 'birthday',
                label: 'Birthday',
                type: 'date',
                // XXX: Must be moment-compatible.
                format: 'YYYY/MM/DD',
                value: '2018/03/04',
                minDate: '2014/02/03',
                maxDate: '2020/02/04',
              },
              {
                label: 'label here',
                // This is a grouped form
                forms: [
                  {
                    key: 'groupedDeeplyNested',
                    //label: 'these are some grouped nested forms',
                    forms: [
                      {
                        required: true,
                        key: 'someVal',
                        label: 'Nested Example',
                        type: 'text',
                      },
                      {
                        //required: true,
                        key: 'birthday',
                        label: 'Birthday',
                        type: 'date',
                        // XXX: Must be moment-compatible.
                        format: 'YYYY/MM/DD',
                        value: '2019/03/04',
                        minDate: '2014/02/03',
                        maxDate: '2020/02/04',
                      },
                    ],
                  },
                ],
              },
              {
                key: 'nestedArrayContents',
                forms: [
                  {
                    // Numeric keys indicate that we should use an array.
                    key: 0,
                    type: 'text',
                    label: 'some array element',
                    value: 'some initialized array element',
                    placeholder: 'hi',
                  },
                  {
                    key: 1,
                    forms: [
                      {
                        key: 'yo',
                        type: 'text',
                        label: 'some other array element',
                        value: 'some other initialized array element',
                        placeholder: 'other hi',
                      },
                    ],
                  },
                ],
              },
              // TODO: Need to error on shared-level duplicate keys.
              {
                key: 'nested',
                forms: [
                  {
                    key: 'deeplyNested',
                    label: 'these are some nested forms at the top level group',
                    forms: [
                      {
                        required: true,
                        key: 'someVal',
                        label: 'Nested Example',
                        type: 'text',
                        value: 'some deeply initialized quantity',
                      },
                      {
                        //required: true,
                        key: 'birthday',
                        label: 'Birthday',
                        type: 'date',
                        // XXX: Must be moment-compatible.
                        format: 'YYYY/MM/DD',
                        value: '2019/03/04',
                        minDate: '2014/02/03',
                        maxDate: '2020/02/04',
                      },
                      {
                        key: 'evenDeeper',
                        forms: [
                          {
                            key: 'email', // XXX: it is safe to reuse key names if they are nested within a unique grouping
                            type: 'text',
                            label: 'this is the deepest nested element',
                            placeholder: 'this is the deepested nested element, honestly',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    key: 'enumExample',
                    label: 'Enum',
                    required: true,
                    type: 'enum',
                    //value: 8,
                    values: [
                      {
                        label: 'Please select something',
                      },
                      {
                        label: 'hi',
                        value: 8,
                        // extraProps for pickerItem
                      },
                    ],
                  },
                ],
              },
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
          handleAuthSubmit(),
          handleSignUpTermsSubmit(),
        ],
      )
        .then(([ auth, signUpTerms ]) => {
          console.log(JSON.stringify(auth));
          console.log(JSON.stringify(signUpTerms));
          //// XXX: Here are your validated results!
          //const emailAddress = auth.get('email');
          //const password = auth.get('password');
          //console.log(auth);
          //console.log(signUpTerms);
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
