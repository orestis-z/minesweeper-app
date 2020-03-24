import React, { Component } from "react";
import { View, Platform, Dimensions } from "react-native";
import Orientation from "react-native-orientation";
import Device from "react-native-device-detection";
import SplashScreen from "react-native-splash-screen";

// config
import { store } from "src/config";

// routes
import { Main as MainScene, Loading } from "src/routes";

// redux
import { connect } from "react-redux";

// lib
import { inAppPurchase, errorHandle } from "src/lib";

const _orientationDidChange = ({ window: { width, height } }) => {
  const orientation = width > height ? "LANDSCAPE" : "PORTRAIT";

  store.dispatch({
    type: "ORIENTATION_CHANGE",
    payload: {
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
      orientation,
    },
  });
};

if (Device.isTablet) Orientation.lockToLandscape();
else if (Platform.OS !== "web") Orientation.lockToPortrait();

Dimensions.addEventListener("change", _orientationDidChange);

_orientationDidChange({ window: Dimensions.get("window") });

const logoMinTime = __DEV__ ? 0 : 2;

export default
@connect(store => ({
  loaded: store.general.loaded,
  purchased: store.general.purchased,
}))
class Main extends Component {
  componentDidMount() {
    if (this.props.loaded) setTimeout(SplashScreen.hide, 200);
  }

  componentDidUpdate() {
    if (this.props.loaded && !this.props.purchased && Platform.OS !== "web")
      inAppPurchase
        .open()
        .then(inAppPurchase.isPurchased)
        .then(
          ({ purchased, purchaseList }) =>
            purchased &&
            this.props.dispatch({
              type: "PURCHASED",
              payload: { purchased, purchaseList },
            }),
        )
        .catch(errorHandle)
        .finally(inAppPurchase.close);
    if (this.props.loaded) setTimeout(SplashScreen.hide, 200);
  }

  render() {
    return this.props.loaded ? <MainScene /> : null;
  }
}
