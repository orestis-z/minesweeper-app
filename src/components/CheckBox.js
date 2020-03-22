import React from "react";

import {
  Text,
  // View,
  // StyleSheet,
  // CheckBox as _CheckBox
} from "react-native";
// import Device from "react-native-device-detection";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function CheckBox(props) {
  const iconName = props.checked
    ? "checkbox-marked-outline"
    : "checkbox-blank-outline";
  // const styles = StyleSheet.create({
  //   label: {
  //     fontSize: 16,
  //   },
  //   icon: {
  //     marginLeft: -10,
  //   },
  // });

  function onPress() {
    props.onPress(!props.checked);
  }
  // if (Device.isAndroid)
  //   return (
  //     <View style={{ flexDirection: "row", alignItems: "center" }}>
  //       <_CheckBox value={props.checked} onValueChange={onPress} />
  //       <Text style={[styles.label, props.labelStyle]}>{props.label}</Text>
  //     </View>
  //   );
  // else
  return (
    <Icon.Button
      name={iconName}
      size={props.size}
      backgroundColor={props.backgroundColor}
      underlayColor={props.underlayColor}
      color={props.color}
      onPress={onPress}
    >
      <Text style={props.labelStyle}>{props.label}</Text>
    </Icon.Button>
  );
}

CheckBox.defaultProps = {
  color: "black",
  backgroundColor: "transparent",
  underlayColor: "transparent",
};
