import React, { Component } from 'react';
import {
  TouchableNativeFeedback,
  Text,
  View,
  Slider,
} from 'react-native';
import {
  MenuContext,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

// components
import {
  CheckBox,
  Touchable,
} from 'src/components';

// redux
import { connect } from 'react-redux';

// lib
import { normalize } from 'src/lib';

import colors from 'src/colors';

const fontSize = normalize(14);
const padding = 8;
const menuOptionsMarginTop = 10;

@connect( store => ({
    level: store.general.level,
}))
class Game extends Component {
  onSelectLevel(value) {
    this.props.dispatch({
      type: 'LEVEL',
      payload: value,
    })
    return false;
  }

  render() {
    return (
      <Menu
        onSelect={ this.onSelectLevel.bind(this) }
      >
        <MenuTrigger
          style={ {
            padding: this.props.padding,
          } }
        >
          <Text
            style={ {
              color: 'black',
              fontSize,
            } }
          >
            Game
          </Text>
        </MenuTrigger>
        <MenuOptions
          style={ {
            marginTop: menuOptionsMarginTop
          } }
        >
          <MenuOption
            value={ 0 }
          >
            <Text
              style={ { color: 'black', fontSize } }
            >
              { (this.props.level === 0 ? ' ✓ ' : '') + ' Beginner'}
            </Text>
          </MenuOption>
          <MenuOption
            value={ 1 }
          >
            <Text
              style={ { color: 'black', fontSize } }
            >
              { (this.props.level === 1 ? ' ✓ ' : '') + ' Intermediate'}
            </Text>
          </MenuOption>
          <MenuOption
            value={ 2 }
          >
            <Text
              style={ { color: 'black', fontSize } }
            >
              { (this.props.level === 2 ? ' ✓ ' : '') + ' Expert'}
            </Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    )
  }
}

@connect( store => ({
  fieldSize: store.general.fieldSize,
  vibrate: store.general.vibrate,
}))
class Options extends Component {
  state={ vibrate: false };

  render() {
    return (
      <Menu
        onSelect={ () => false }
      >
        <MenuTrigger
          style={ {
            padding: this.props.padding,
          } }
        >
          <Text
            style={ {
              color: 'black',
              fontSize,
            } }
          >
            Options
          </Text>
        </MenuTrigger>
        <MenuOptions
          style={ {
            marginTop: menuOptionsMarginTop
          } }
        >
          <MenuOption
            value={ 0 }
          >
            <View>
              <Text
                style={ { color: 'black', fontSize } }
              >
                { ' Size:' }
              </Text>
              <Slider
                value={ 4 - this.props.fieldSize }
                step={ 1 }
                minimumValue={ 0 }
                maximumValue={ 4 }
                onValueChange={ value => this.props.dispatch({
                  type: 'FIELD_SIZE',
                  payload: 4 - value,
                }) }
              />
            </View>
          </MenuOption>
          <MenuOption
            value={ 1 }
            onSelect={ () => {this.props.dispatch({
              type: 'VIBRATE',
              payload: !this.props.vibrate,
            }); return false;} }
          >
            <CheckBox
              label="Vibrate"
              labelStyle={ { color: 'black', fontSize } }
              checked={ this.props.vibrate }
              onPress={ () => this.props.dispatch({
                type: 'VIBRATE',
                payload: !this.props.vibrate,
              }) }
              size={ fontSize * 1.7 }
            />
          </MenuOption>
        </MenuOptions>
      </Menu>
    )
  }
}

class More extends Component {
  onSelectLevel(value) {
    if (value === 0)
      this.props.purchase();
  }

  render() {
    return (
      <Menu
        onSelect={ this.onSelectLevel.bind(this) }
      >
        <MenuTrigger
          style={ {
            padding: this.props.padding,
          } }
        >
          <Text
            style={ {
              color: 'black',
              fontSize,
            } }
          >
            More
          </Text>
        </MenuTrigger>
        <MenuOptions
          style={ {
            marginTop: menuOptionsMarginTop
          } }
        >
          <MenuOption
            value={ 0 }
          >
            <Text
              style={ { color: 'black', fontSize } }
            >
              { ' Pay what you want' }
            </Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    )
  }
}

export default class _Menu extends Component {
  render() {
    const padding = (this.props.height - 13) / 2;
    return (
      <View
        style={ {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: this.props.height,
          backgroundColor: colors.greyMain,
          paddingRight: 5,
          paddingLeft: 5,
        } }
      >
        <Game
          padding={ padding }
        />
        <Options
          padding={ padding }
        />
        <More
          padding={ padding }
          purchase={ this.props.purchase }
        />
      </View>
    );
  }
};
