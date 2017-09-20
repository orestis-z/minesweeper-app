import React, { Component } from 'react';
import {
  View,
  WebView,
} from 'react-native';


export default class Donate extends Component {
  static navigationOptions = {
    title: 'Donate',
    headerStyle: { paddingTop: 0 },
  };

  render () {
    return (
      <WebView
        source={ require("./donate.html") }
        startInLoadingState={true}

        // style={ {
        //   flex: 1,
        //   justifyContent: 'center',
        //   alignItems: 'center',
        // } }
      />
    )
  }
};
