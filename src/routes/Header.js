import React, { Component, PureComponent } from "react";
import { Image, StyleSheet, Platform, Text, View } from "react-native";

// components
import { Touchable, MaterialDialog } from "src/components";

// images
import {
  flagImage,
  mineImage,
  smileImage,
  neutralImage,
  sadImage,
  sunglassesImage,
} from "src/assets/images";

// redux
import { connect } from "react-redux";

import colors from "src/colors";

class Button extends Component {
  render() {
    return (
      <Touchable
        onPress={this.props.onPress}
        onPressIn={this.props.onPressIn}
        onPressOut={this.props.onPressOut}
      >
        <View>
          <View style={styles.triangleCorner} />
          <View style={styles.square} />
          {this.props.children}
        </View>
      </Touchable>
    );
  }
}

@connect(store => ({
  gameState: store.game.gameState,
}))
class Smiley extends PureComponent {
  render() {
    return (
      <View style={styles.smileyContainer}>
        <Image
          source={
            this.props.gameState == "WON"
              ? sunglassesImage
              : this.props.gameState == "LOST"
              ? sadImage
              : this.props.pressed
              ? neutralImage
              : smileImage
          }
          style={styles.smiley}
          resizeMode="contain"
        />
      </View>
    );
  }
}

class SmileyBtn extends PureComponent {
  state = { pressed: false };

  render() {
    return (
      <View style={{ margin: elementMargin, marginRight: 0 }}>
        <Button
          onPress={() => this.props.reset()}
          onPressIn={() => this.setState({ pressed: true })}
          onPressOut={() => this.setState({ pressed: false })}
        >
          <Smiley pressed={this.state.pressed} />
        </Button>
      </View>
    );
  }
}

class Flag extends PureComponent {
  render() {
    return (
      <View style={styles.flagContainer}>
        <Image
          source={this.props.inputMode ? flagImage : mineImage}
          style={styles.smiley}
          resizeMode="contain"
        />
      </View>
    );
  }
}

@connect(store => ({
  inputMode: store.game.inputMode,
}))
class FlagBtn extends PureComponent {
  render() {
    return (
      <View style={{ margin: elementMargin, marginLeft: 0 }}>
        <Button
          onPress={() =>
            this.props.dispatch({
              type: "INPUT_MODE_CHANGE",
              payload: !this.props.inputMode,
            })
          }
        >
          <Flag inputMode={this.props.inputMode} />
        </Button>
      </View>
    );
  }
}

class Timer extends PureComponent {
  render() {
    const { count } = this.props;

    return (
      <View
        style={{
          backgroundColor: "black",
          width: 80,
          height: 50,
          marginVertical: elementMargin,
        }}
      >
        <View
          style={{
            left: 6,
            top: Platform.OS === "ios" ? 5 : 2,
          }}
        >
          <View
            style={{
              position: "absolute",
              width: 80,
              height: 50,
              backgroundColor: "transparent",
            }}
          >
            <Text
              style={{
                fontFamily: "digital",
                fontSize: 50,
                color: colors.red,
                opacity: 0.4,
              }}
            >
              {"000"}
            </Text>
          </View>
          <View
            style={{
              position: "absolute",
              width: 80,
              height: 50,
              backgroundColor: "transparent",
            }}
          >
            <Text
              style={{
                fontFamily: "digital",
                fontSize: 50,
                color: colors.red,
              }}
            >
              {count < 10
                ? "00" + count
                : count < 100
                ? "0" + count
                : count < 1000
                ? "" + count
                : "" + 999}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export default
@connect(store => ({
  gameState: store.game.gameState,
  time: store.game.time,
  mineCount: store.game.mineCount,
  inputMode: store.game.inputMode,
}))
class Header extends Component {
  state = { dialogVisible: false };

  _reset() {
    this.props.mines.reset();
    this.props.clearTimer();
    this.props.dispatch({
      type: "NEW_GAME",
    });
  }

  reset = () => {
    if (this.props.gameState === "STARTED") {
      this.setState({ dialogVisible: true });
    } else this._reset();
  };

  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.greyMain,
        }}
      >
        {Platform.OS == "web" || (
          <MaterialDialog
            title={"Restart Game?"}
            style={{
              title: {
                fontFamily: "win95",
              },
              actionButton: { fontFamily: "win95" },
            }}
            visible={this.state.dialogVisible}
            onOk={() => {
              this.setState({ dialogVisible: false });
              this._reset();
            }}
            onCancel={() => this.setState({ dialogVisible: false })}
          />
        )}
        <View style={{ flexShrink: 1, width: 20 }} />
        <Timer count={this.props.mineCount} />
        <View style={{ flexGrow: 1, minWidth: 10 }} />
        <SmileyBtn reset={this.reset} />
        <View style={{ flexShrink: 2, width: 20 }} />
        <FlagBtn inputMode={this.props.inputMode} />
        <View style={{ flexGrow: 1, minWidth: 10 }} />
        <Timer count={this.props.time} />
        <View style={{ flexShrink: 1, width: 20 }} />
      </View>
    );
  }
}

const elementMargin = 10;
const buttonHeight = 60;

export const headerHeight = buttonHeight + 2 * elementMargin;

const smileyDiam = 40;
const smileySquareSize = 50;

const smileyBorder = (buttonHeight - smileySquareSize) / 2;
const smileyMargin = (buttonHeight - smileyDiam) / 2;

const styles = StyleSheet.create({
  smiley: {
    width: smileyDiam,
    height: smileyDiam,
    // borderWidth: 10,
    // borderColor: 'red'
  },
  smileyContainer: {
    position: "absolute",
    left: smileyMargin,
    top: smileyMargin,
    height: smileyDiam,
    width: smileyDiam,
    alignItems: "center",
    backgroundColor: colors.yellowSmiley,
    borderRadius: smileyDiam / 2,
  },
  flagContainer: {
    position: "absolute",
    left: smileyMargin,
    top: smileyMargin,
    height: smileyDiam,
    width: smileyDiam,
    alignItems: "center",
  },
  triangleCorner: {
    width: 0,
    height: 0,
    backgroundColor: colors.greyShade,
    borderStyle: "solid",
    borderRightWidth: buttonHeight,
    borderTopWidth: buttonHeight,
    borderRightColor: "transparent",
    borderTopColor: colors.greyLight,
  },
  square: {
    position: "absolute",
    left: smileyBorder,
    top: smileyBorder,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.greyMain,
    height: smileySquareSize,
    width: smileySquareSize,
  },
});
