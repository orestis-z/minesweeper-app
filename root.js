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

AppRegistry.registerComponent('MineSweeperTest', () => ReactNativeBaseProject);
