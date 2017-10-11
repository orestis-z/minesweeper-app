import React from 'react';

import {
  Text,
  View,
  StyleSheet,
  CheckBox as _CheckBox,
} from 'react-native';

export default function CheckBox(props) {
  const iconName = props.checked ? props.checkedIconName : props.uncheckedIconName;
  const styles = StyleSheet.create({
    label: {
      fontSize: 16,
    },
    icon: {
      marginLeft: -10,
    },
  });

  function onPress() {
    props.onPress(!props.checked);
  }

  return (
    <View
      style={{flexDirection: 'row', alignItems: 'center'}}
    >
      <_CheckBox
        value={props.checked}
        onValueChange={onPress}
      />
      <Text
        style={[styles.label, props.labelStyle]}
      >
        { props.label }
      </Text>
    </View>
  );
}
