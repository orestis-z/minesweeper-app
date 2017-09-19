import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import codePush from "react-native-code-push";

import Root from 'src';
import {
  MenuContext,
} from 'react-native-popup-menu';

if (__DEV__)
  Promise = require("bluebird"); // better warnings for promises

// @codePush
export default class ReactNativeBaseProject extends Component {
  render() {
    return (
      <MenuContext>
        <Root/>
      </MenuContext>
    );
  }
};

// import InAppBilling from 'react-native-billing';

// InAppBilling.open()
// .then(() => InAppBilling.purchase('android.test.purchased'))
// .then((details) => {
//   console.log("You purchased: ", details)
//   return InAppBilling.close()
// })
// .catch((err) => {
//   console.log(err);
// });


AppRegistry.registerComponent('MineSweeperTest', () => ReactNativeBaseProject);
