import React, { Component } from "react";
import { View, Animated, Easing, PixelRatio } from "react-native";

const dpi = PixelRatio.get();
let factor;
if (dpi == 3.5) factor = 4;
else factor = dpi;

export default class Loading extends Component {
  constructor() {
    super();
    this.spinValue = new Animated.Value(0);
  }

  componentDidMount() {
    this.spin();
  }

  spin() {
    this.spinValue.setValue(0);
    Animated.timing(this.spinValue, {
      toValue: 1,
      duration: 4000,
      easing: Easing.linear,
    }).start(() => this.spin());
  }

  render() {
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Animated.Image
          style={{
            transform: [{ rotate: spin }],
            width: (512 * factor) / 4,
            height: (512 * factor) / 4,
          }}
          source={require("src/assets/images/mineLarge.png")}
        />
      </View>
    );
  }
}
