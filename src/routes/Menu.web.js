import React, { Component } from "react";
import { Text, View } from "react-native";

// redux
import { connect } from "react-redux";

// lib
import { normalize } from "src/lib";

import colors from "src/colors";

const fontSize = normalize(14);

@connect(store => ({
  level: store.general.level,
}))
class Game extends Component {
  onSelectLevel(value) {
    this.props.dispatch({
      type: "LEVEL",
      payload: value,
    });
    return false;
  }

  render() {
    return (
      <Text
        style={{
          color: "black",
          fontSize,
          paddingHorizontal: 20,
        }}
      >
        <Text style={{ textDecoration: "underline" }}>G</Text>
        <Text>ame</Text>
      </Text>
    );
  }
}

@connect(store => ({
  fieldSize: store.general.fieldSize,
  vibrate: store.general.vibrate,
}))
class Options extends Component {
  state = { vibrate: false };

  render() {
    return (
      <Text
        style={{
          color: "black",
          fontSize,
          paddingHorizontal: 20,
        }}
      >
        <Text style={{ textDecoration: "underline" }}>O</Text>
        <Text>ptions</Text>
      </Text>
    );
  }
}

class More extends Component {
  onSelectLevel(value) {
    if (value === 0) this.props.purchase();
  }

  render() {
    return (
      <Text
        style={{
          color: "black",
          fontSize,
          paddingHorizontal: 20,
        }}
      >
        <Text style={{ textDecoration: "underline" }}>M</Text>
        <Text>ore</Text>
      </Text>
    );
  }
}

export default class _Menu extends Component {
  render() {
    const padding = (this.props.height - 13) / 2;
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: this.props.height,
          backgroundColor: colors.greyMain,
          paddingRight: 5,
          paddingLeft: 5,
        }}
      >
        <Game padding={padding} />
        <Options padding={padding} />
        <More padding={padding} purchase={this.props.purchase} />
      </View>
    );
  }
}
