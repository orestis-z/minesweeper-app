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
import { inAppPurchase } from "src/lib";

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
  // constructor(props) {
  //   super(props);

  //   inAppPurchase.open()
  //   .then(inAppPurchase.consumeAll) // testing
  //   .then(() => store.dispatch({
  //     type: 'PURCHASED',
  //     payload: {purchased: false, purchaseList: [false, false, false, false, false]}
  //   })) // testing
  //   .then(inAppPurchase.close);
  // }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (nextProps.loaded && !nextProps.purchased && Platform.OS !== "web")
      inAppPurchase
        .open()
        .then(inAppPurchase.isPurchased)
        .then(
          ({ purchased, purchaseList }) =>
            purchased &&
            nextProps.dispatch({
              type: "PURCHASED",
              payload: { purchased, purchaseList },
            }),
        )
        .then(inAppPurchase.close)
        .catch(inAppPurchase.close);

    if (nextProps.loaded) SplashScreen.hide();
    // .catch(err => {errorHandle(err); inAppPurchase.close()}); // testing
  }

  render() {
    return <MainScene />;
  }
}
