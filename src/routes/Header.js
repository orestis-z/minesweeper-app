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
  flagImage,
  mineImage,
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

class Flag extends Component {
  render() {
    return (
      <View
        style={ styles.flagContainer }
      >
        <Image
          source={ this.props.inputMode ? flagImage : mineImage }
          style={ styles.smiley }
          resizeMode='contain'
        />
      </View>
    )
  }
}

class FlagBtn extends Component {
  render() {
    return (
      <View
      style={ {margin: 10} }
      >
        <Button
          onPress={ this.props.changeInputMode }   
        >
          <Flag
            inputMode={ this.props.inputMode }
          />
        </Button>
      </View>
    )
  }
}

class Timer extends Component {
  render() {
    const { count } = this.props;

    return (
      <View
        style={ {
          backgroundColor: 'black',
          width: 80,
          height: 50,
          margin: 10,
        } }
      >
        <View
          style={ {
            left: 6,
            top: 2,
          } }
        >
          <View
            style={ {
              position: 'absolute',
              width: 80,
              height: 50,
            } }
          >
            <Text
              style={ {
                fontFamily: 'digital',
                fontSize: 50, 
                color: colors.red,
                opacity: 0.4,
              } }
            >
              { '000' }
            </Text>
          </View>
          <View
            style={ {
              position: 'absolute',
              width: 80,
              height: 50,
            } }
          >
            <Text
              style={ {
                fontFamily: 'digital',
                fontSize: 50,
                color: colors.red,
              } }
            >
              { count < 10 ? '00' + count :
                count < 100 ? '0' + count :
                count < 1000 ? '' + count :
                '' + 999
              }
            </Text>
          </View>
        </View>
      </View>
    )
  }
}

export default class Header extends Component {
  render() {
    console.log(this.props.mines)
    return (
      <View
        style={ {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: colors.greyMain,
        } }
      >
        <Timer
          count={ this.props.mineCount }
        />
        <SmileyBtn
          reset={ this.props.mines.reset }
          gameState={ this.props.gameState }
        />
        <FlagBtn
          inputMode={ this.props.inputMode }
          changeInputMode={ this.props.changeInputMode }
        />
        <Timer
          count={ this.props.time }
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
  flagContainer: {
    position: 'absolute',
    left: smileyMargin,
    top: smileyMargin,
    height: smileyDiam,
    width: smileyDiam,
    alignItems: 'center',
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
