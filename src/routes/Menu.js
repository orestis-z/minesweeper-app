import React, { Component } from "react";
import { Text, View, Slider, Share } from "react-native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// components
import { CheckBox } from "src/components";

// redux
import { connect } from "react-redux";

// lib
import { normalize, errorHandle } from "src/lib";

// config
import { params } from "src/config";

import colors from "src/colors";

const fontSize = normalize(14);
const menuOptionsMarginVertical = 10;

const Label = ({ label }) => (
  <View
    style={{
      paddingHorizontal: 20,
      flexDirection: "row",
    }}
  >
    <View style={{ borderBottomWidth: 1.5, paddingLeft: 2 }}>
      <Text style={{ fontSize, fontFamily: "win95", color: "black" }}>
        {label[0]}
      </Text>
    </View>
    <Text style={{ fontSize, fontFamily: "win95", color: "black" }}>
      {label.slice(1, label.length)}
    </Text>
  </View>
);

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
    const { level, padding } = this.props;
    return (
      <Menu onSelect={this.onSelectLevel.bind(this)}>
        <MenuTrigger
          style={{
            padding: padding,
          }}
        >
          <Label label="Game" />
        </MenuTrigger>
        <MenuOptions
          style={{
            marginVertical: menuOptionsMarginVertical,
          }}
        >
          <MenuOption value={0}>
            <Text
              style={{
                color: "black",
                fontSize,
                fontFamily: "win95",
                backgroundColor:
                  level === 0 ? "rgba(0,0,0,0.1)" : "transparent",
                paddingVertical: menuOptionsMarginVertical,
                paddingHorizontal: menuOptionsMarginVertical,
              }}
            >
              Beginner
            </Text>
          </MenuOption>
          <MenuOption value={1}>
            <Text
              style={{
                color: "black",
                fontSize,
                fontFamily: "win95",
                backgroundColor:
                  level === 1 ? "rgba(0,0,0,0.1)" : "transparent",
                paddingVertical: menuOptionsMarginVertical,
                paddingHorizontal: menuOptionsMarginVertical,
              }}
            >
              Intermediate
            </Text>
          </MenuOption>
          <MenuOption value={2}>
            <Text
              style={{
                color: "black",
                fontSize,
                fontFamily: "win95",
                backgroundColor:
                  level === 2 ? "rgba(0,0,0,0.1)" : "transparent",
                paddingVertical: menuOptionsMarginVertical,
                paddingHorizontal: menuOptionsMarginVertical,
              }}
            >
              Expert
            </Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    );
  }
}

@connect(store => ({
  fieldSize: store.general.fieldSize,
  vibrate: store.general.vibrate,
  flavour: store.general.flavour,
}))
class Options extends Component {
  state = { vibrate: false };

  render() {
    return (
      <Menu onSelect={() => false}>
        <MenuTrigger
          style={{
            padding: this.props.padding,
          }}
        >
          <Label label="Options" />
        </MenuTrigger>
        <MenuOptions
          style={{
            marginVertical: menuOptionsMarginVertical,
          }}
        >
          <MenuOption value={0}>
            <View>
              <Text style={{ color: "black", fontSize, fontFamily: "win95" }}>
                {" Size:"}
              </Text>
              <Slider
                value={4 - this.props.fieldSize}
                step={1}
                minimumValue={0}
                maximumValue={4}
                onValueChange={value =>
                  this.props.dispatch({
                    type: "FIELD_SIZE",
                    payload: 4 - value,
                  })
                }
                minimumTrackTintColor="rgb(64,64,64)"
                thumbTintColor="rgb(64,64,64)"
              />
            </View>
          </MenuOption>
          <MenuOption
            value={1}
            onSelect={() => {
              this.props.dispatch({
                type: "VIBRATE",
                payload: !this.props.vibrate,
              });
              return false;
            }}
          >
            <CheckBox
              label="Vibrate"
              labelStyle={{
                color: "black",
                fontSize,
                fontFamily: "win95",
              }}
              checked={this.props.vibrate}
              onPress={() =>
                this.props.dispatch({
                  type: "VIBRATE",
                  payload: !this.props.vibrate,
                })
              }
              size={fontSize * 1.7}
            />
          </MenuOption>
          <MenuOption value={3}>
            <View>
              <Text style={{ color: "black", fontSize, fontFamily: "win95" }}>
                {" Flavour:"}
              </Text>
              {["Distraction Free", "Windows 95", "Windows 98"].map(
                (flavour, i) => (
                  <Icon.Button
                    key={i}
                    name={
                      "radiobox-" +
                      (this.props.flavour == i ? "marked" : "blank")
                    }
                    size={fontSize * 1.7}
                    backgroundColor="transparent"
                    underlayColor="transparent"
                    color="black"
                    onPress={() =>
                      this.props.dispatch({ type: "FLAVOUR", payload: i })
                    }
                  >
                    <Text style={{ color: "black", fontFamily: "win95" }}>
                      {flavour}
                    </Text>
                  </Icon.Button>
                ),
              )}
            </View>
          </MenuOption>
        </MenuOptions>
      </Menu>
    );
  }
}

@connect(store => ({
  purchased: store.general.purchased,
  gameCounter: store.general.gameCounter,
}))
class More extends Component {
  onSelectLevel(value) {
    if (value === 0) this.props.purchase();
    if (value === 1)
      Share.share({
        subject: "Minesweeper Original",
        message: `Check out "Minesweeper Original", an authentic remake of the old school puzzle game: https://play.google.com/store/apps/details?id=com.kima.minesweeper`,
        url:
          "https://play.google.com/store/apps/details?id=com.kima.minesweeper",
      }).catch(errorHandle);
  }

  render() {
    return (
      <Menu onSelect={this.onSelectLevel.bind(this)}>
        <MenuTrigger
          style={{
            padding: this.props.padding,
          }}
        >
          <Label label="More" />
        </MenuTrigger>
        <MenuOptions
          style={{
            marginVertical: menuOptionsMarginVertical,
          }}
        >
          <MenuOption value={0}>
            <Text
              style={{
                color: "black",
                fontSize,
                fontFamily: "win95",
                marginVertical: menuOptionsMarginVertical,
              }}
            >
              {!this.props.purchased &&
              this.props.gameCounter > params.adFactor * params.purchaseInterval
                ? " Remove ads"
                : " Support me"}
            </Text>
          </MenuOption>

          <MenuOption value={1}>
            <Text
              style={{
                color: "black",
                fontSize,
                fontFamily: "win95",
                marginVertical: menuOptionsMarginVertical,
              }}
            >
              {" Share"}
            </Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    );
  }
}

export default class _Menu extends Component {
  render() {
    const padding = Math.min((this.props.height - 13) / 2, 10);
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
