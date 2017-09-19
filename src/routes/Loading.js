import React, { Component } from 'react';
import {
  View,
  Animated,
  Easing,
} from 'react-native';


export default class Loading extends Component {
  constructor () {
    super()
    this.spinValue = new Animated.Value(0)
  }

  componentDidMount () {
    this.spin()
  }

  spin () {
    this.spinValue.setValue(0)
    Animated.timing(
      this.spinValue,
      {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear
      }
    ).start(() => this.spin())
  }

  render () {
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })
    return (
      <View
        style={ {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        } }
      >
        <Animated.Image
          style={{
            transform: [{rotate: spin}] }}
            source={ require('src/assets/images/mine.png') }
        />
      </View>
    )
  }
};
