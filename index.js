import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import codePush from "react-native-code-push";

import Root from 'src';
import {
  MenuContext,
} from 'react-native-popup-menu';

const __DEV__ = true;

if (__DEV__) {
  Promise = require("bluebird"); // better warnings for promises
  codePush.allowRestart();
}

@codePush({
  updateDialog: __DEV__,
  checkFrequency: __DEV__ ? codePush.CheckFrequency.ON_APP_RESUME : codePush.CheckFrequency.ON_APP_START,
  installMode: __DEV__ ? codePush.InstallMode.IMMEDIATE : codePush.InstallMode.ON_NEXT_RESUME})
export default class Minesweeper extends Component {
  render() {
    return (
      <MenuContext>
        <Root/>
      </MenuContext>
    );
  }
};

AppRegistry.registerComponent('Minesweeper', () => Minesweeper);
