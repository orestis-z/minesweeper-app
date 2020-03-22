import React from "react";
import { Provider } from "react-redux";
import { View, StatusBar } from "react-native";

import Main from "./Main";

// config
import { store } from "src/config";

// components
import { Component } from "src/components";

export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
          }}
        >
          <StatusBar hidden={true} />
          <Main />
        </View>
      </Provider>
    );
  }
}
