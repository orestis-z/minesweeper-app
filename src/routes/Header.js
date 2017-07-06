import React, { Component } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  TouchableNativeFeedback,
  Text,
  View,
} from 'react-native';

import {
  smileImage,
  neutralImage,
  sadImage,
  sunglassesImage,
} from 'src/assets/images';

import colors from 'src/colors';

class Button extends Component {
  render() {
    return (
      <TouchableNativeFeedback
        onPress={ this.props.onPress }      
        onPressIn={ this.props.onPressIn }
        onPressOut={ this.props.onPressOut }
      >
        <View
          // style={  }
        >
          <View
            style={ styles.triangleCorner }
          />
          <View
            style={ styles.square }
          />
          { this.props.children }
        </View>
      </TouchableNativeFeedback>
    );
  }
}

class Smiley extends Component {
  render() {
    return (
      <View
        style={ styles.smileyContainer }
      >
        <Image
          source={ this.props.gameState == 'WON' ? sunglassesImage : this.props.gameState == 'LOST' ? sadImage : this.props.pressed ? neutralImage : smileImage }
          style={ styles.smiley }
          resizeMode='contain'
        />
      </View>
    )
  }
}

class SmileyBtn extends Component {
  state = { pressed: false }
  render() {
    return (
      <View
      style={ {margin: 10} }
      >
        <Button
          onPress={ () => this.props.reset() }      
          onPressIn={ () => this.setState({pressed: true}) }
          onPressOut={ () => this.setState({pressed: false}) }
        >
          <Smiley
            pressed={ this.state.pressed }
            gameState={ this.props.gameState }
          />
        </Button>
      </View>
    )
  }
}

export default class Header extends Component {
  render() {
    return (
      <View
        style={ {
          alignItems: 'center',
          backgroundColor: colors.greyMain,
        } }
      >
        <SmileyBtn
          reset={ this.props.mines.reset }
          gameState={ this.props.gameState }
        />
      </View>
    );
  }
}

const smileyDiam = 40;
const smileySquareSize = 50;
const buttonHeight = 60;

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
    position: 'absolute',
    left: smileyMargin,
    top: smileyMargin,
    height: smileyDiam,
    width: smileyDiam,
    alignItems: 'center',
    backgroundColor: colors.yellowSmiley,
    borderRadius: smileyDiam  / 2,
  },
  triangleCorner: {
    width: 0,
    height: 0,
    backgroundColor: colors.greyShade,
    borderStyle: 'solid',
    borderRightWidth: buttonHeight,
    borderTopWidth: buttonHeight,
    borderRightColor: 'transparent',
    borderTopColor: colors.greyLight,
  },
  square: {
    position: 'absolute',
    left: smileyBorder,
    top: smileyBorder,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.greyMain,
    height: smileySquareSize,
    width: smileySquareSize,
    // top: squareBorderScaled,
    // left: squareBorderScaled,
  },
})
