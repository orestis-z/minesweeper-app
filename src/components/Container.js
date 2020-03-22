import React from "react";
import { View } from "react-native";

import Component from "./Component";

export default class Container extends Component {
  render() {
    return (
      <View style={{ backgroundColor: "white" }} {...this.props}>
        {this.props.children}
      </View>
    );
  }
}
