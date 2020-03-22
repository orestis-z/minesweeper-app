import React, { PureComponent } from "react";
import { View, Image, Platform } from "react-native";
import RNExitApp from "react-native-exit-app";
import LinearGradient from "react-native-linear-gradient";
import { minBarHeight } from "./Main";
// lib
// import { normalize } from "src/lib";

import colors from "src/colors";

import { MaterialDialog } from "src/components";

// const fontSize = normalize(14);

// images
import { logo95Image, barBtns95Image, barText95Image } from "src/assets/images";

// components
import { Touchable } from "src/components";

export default class Bar extends PureComponent {
  state = { dialogVisible: false };

  exitApp = () => this.setState({ dialogVisible: true });
  hideDialog = () => this.setState({ dialogVisible: false });

  render() {
    const { height, flavour } = this.props;
    const scale = height / minBarHeight;
    const imgHeight = Math.min(minBarHeight * 1.3, height);
    return (
      <React.Fragment>
        {Platform.OS == "web" || (
          <MaterialDialog
            title="Exit Game?"
            style={{
              title: {
                fontFamily: "win95",
              },
              actionButton: { fontFamily: "win95" },
            }}
            visible={this.state.dialogVisible}
            onOk={RNExitApp.exitApp}
            onCancel={this.hideDialog}
          />
        )}
        <LinearGradient
          colors={[
            colors.wind95Bg,
            flavour == 2 ? "rgb(60,129,198)" : colors.wind95Bg,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.wind95Bg,
            paddingHorizontal: 3,
            height: height,
          }}
        >
          <Image
            source={logo95Image}
            style={{
              width: height - 10 * scale,
              height: height - 10 * scale,
              marginLeft: 2,
            }}
            resizeMode="contain"
          />
          <Image
            source={barText95Image}
            style={{
              width: ((imgHeight - 12 * scale) / 64) * 425,
              height: imgHeight - 12 * scale,
              marginLeft: 10,
            }}
            resizeMode="contain"
          />

          <View style={{ flexGrow: 1 }} />
          <View>
            <Image
              source={barBtns95Image}
              style={{
                width: ((imgHeight - 10 * scale) / 64) * 229,
                height: imgHeight - 10 * scale,
              }}
              resizeMode="contain"
            />
            <Touchable onPress={this.exitApp}>
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  height: imgHeight - 10 * scale,
                  width: imgHeight - 8 * scale,
                }}
              />
            </Touchable>
          </View>
        </LinearGradient>
      </React.Fragment>
    );
  }
}
