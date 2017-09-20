import React, { Component } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Platform,
  Text,
  View,
} from 'react-native';

// components
import {
  Touchable,
} from 'src/components';

// images
import {
  flagImage,
  mineImage,
  smileImage,
  neutralImage,
  sadImage,
  sunglassesImage,
} from 'src/assets/images';

// redux
import { connect } from 'react-redux';

import colors from 'src/colors';

class Button extends Component {
  render() {
    return (
      <Touchable
        onPress={ this.props.onPress }      
        onPressIn={ this.props.onPressIn }
        onPressOut={ this.props.onPressOut }
      >
        <View>
          <View
            style={ styles.triangleCorner }
          />
          <View
            style={ styles.square }
          />
          { this.props.children }
        </View>
      </Touchable>
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
        style={ {margin: elementMargin} }
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
      style={ {margin: elementMargin} }
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
          margin: elementMargin,
        } }
      >
        <View
          style={ {
            left: 6,
            top: (Platform.OS === 'ios') ? 5 : 2,
          } }
        >
          <View
            style={ {
              position: 'absolute',
              width: 80,
              height: 50,
              backgroundColor: 'transparent',
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
              backgroundColor: 'transparent',
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

@connect()
export default class Header extends Component {
  _reset() {
    this.props.mines.reset();
    this.props.dispatch({
      type: 'NEW_GAME',
    })
  }
  reset() {
    if (this.props.gameState === 'STARTED' ) {
      Alert.alert('Restart Game?', null,
        [
          { text: 'OK', onPress: () => this._reset() },
          { text: 'Cancel', style: 'cancel' },
        ],
        { cancelable: false });
    }
    else
      this._reset();
    
  }

  render() {
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
          reset={ this.reset.bind(this) }
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
  },
})
