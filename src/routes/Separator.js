import React, { PureComponent } from "react";
import { View } from "react-native";

// redux
import { connect } from "react-redux";

import colors from "src/colors";

const separatorBorderWidth = 4;
const separatorInlineWidth = 9;

@connect(store => ({
  windowSize: store.general.windowSize,
}))
class HorizontalSeparator extends PureComponent {
  static separatorWidth = separatorInlineWidth + 2 * separatorBorderWidth;

  render() {
    const {
      windowSize: { width },
    } = this.props;

    return (
      <View>
        <View
          style={{
            width,
            height: separatorBorderWidth,
            backgroundColor: colors.greyLight,
          }}
        />
        <View
          style={{
            width,
            height: separatorInlineWidth,
            backgroundColor: colors.greyMain,
          }}
        />
        <View
          style={{
            width,
            height: separatorBorderWidth,
            backgroundColor: colors.greyShade,
          }}
        />
      </View>
    );
  }
}

class VerticalSeparator extends PureComponent {
  static separatorWidth = separatorInlineWidth + 2 * separatorBorderWidth;

  render() {
    return (
      <View style={{ flexDirection: "row", ...this.props.style }}>
        <View
          style={{
            height: "100%",
            width: separatorBorderWidth,
            backgroundColor: colors.greyLight,
          }}
        />
        <View
          style={{
            height: "100%",
            width: separatorInlineWidth,
            backgroundColor: colors.greyMain,
          }}
        />
        <View
          style={{
            height: "100%",
            width: separatorBorderWidth,
            backgroundColor: colors.greyShade,
          }}
        />
      </View>
    );
  }
}

export { HorizontalSeparator, VerticalSeparator };
