import React, { Component } from 'react';
import {
  TouchableNativeFeedback,
  TouchableHighlight,
  Platform,
} from 'react-native';

const _Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableHighlight;

export default class Touchable extends Component {
  render() {
    return (
      <_Touchable
        {...this.props}
      >
        {this.props.children}
      </_Touchable>
    );
  }
}
