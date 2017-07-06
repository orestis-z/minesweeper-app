import React, { Component } from 'react';
import {
  Alert,
  AppRegistry,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View
} from 'react-native';
import _ from 'lodash';
import minesLogic from 'mines';

import colors from 'src/colors';

import {
  crossImage,
  flagImage,
  mineImage,
} from 'src/assets/images';

class Button extends Component {
  render() {
    const { mines, mark, styles } = this.props;

    return (
      <TouchableNativeFeedback
        onPress={ () => mines.reveal([this.props.i, this.props.j]) }
        onLongPress={ () => mines.mark([this.props.i, this.props.j]) }
      >
        <View
          style={ [styles.button,
            {
              top: this.props.y,
              left: this.props.x
            }
          ] }
        >
          <View
            style={ styles.triangleCorner }
          />
          <View
            style={ styles.square }
          >
            { mark == 'MARKED' ?
                <Image
                  source={ flagImage }
                  style={ styles.iconFlag }
                  resizeMode='contain'
                />
              :
                <Text
                  style={ styles.question }
                >
                  { mark && '?' }
                </Text>
            }
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }
}


class ButtonPressed extends Component {
  render() {
    const { nMines, styles } = this.props;

    return (
      <View
        style={ [styles.buttonPressed,
          {
            top: this.props.y,
            left: this.props.x
          }
        ] }
      >
        <View
          style={ nMines == 10 ? styles.squarePressedExploded : styles.squarePressed }
        >
          { nMines < 9 ?
              <Text
                style={ [
                  styles.nMines,
                  {
                    color: nMines &&
                      nMines == 1 ? colors.blue :
                      nMines == 2 ? colors.green :
                      nMines == 3 ? colors.red :
                      nMines == 4 ? colors.blueDark : 
                      nMines == 5 ? colors.redDark : 
                      nMines == 6 ? colors.blueDark : 
                      nMines == 7 ? 'black' :
                      nMines == 8 ? colors.greyShade : 
                      undefined,
                  },
                ] }
              >
                { nMines != 0 && nMines }
              </Text>
            :
              <Image
                source={ nMines == 11 ? crossImage : mineImage }
                style={ nMines == 11 ? styles.iconCross : styles.iconMine }
                resizeMode='contain'
              />
        }
        </View>
      </View>
    );
  }
}

export default class MineSweeperTest extends Component {
  state = {};

  range = _.range(9);

  constructor(props) {
    super(props);

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        this.state[i + ', ' + j] = undefined;
      }
    }

    this.mines = minesLogic.create({preset: 'beginner'});

    this.mines.onCellStateChange((cell, state) => {
      this.setState({[cell[0] + ', ' + cell[1]] : state});
    });
  }

  componentWillMount() {
    const {height, width} = Dimensions.get('window');
    this.buttonDim = width / 9;
    const scale = this.buttonDim / (squareDim + 2 * squareBorder);
    this.styles = styles(scale);
  }

  render() {
    return (
      <View>
        { this.range.map(i =>
          this.range.map(j => {
            const cellState = this.state[i + ', ' + j];

            if (isNaN(cellState))
              return (
                <Button
                  mines={ this.mines }
                  styles={ this.styles }
                  x={ this.buttonDim * j }
                  y={ this.buttonDim * i }
                  i={ i }
                  j={ j }
                  mark={ cellState }
                />
              )
            else
              return (
                <ButtonPressed
                  styles={ this.styles }
                  x={ this.buttonDim * j }
                  y={ this.buttonDim * i }
                  nMines={ cellState }
                />
              )
          })
        ) }
      </View>
    );
  }
}

const squareDim = 8;
const squareBorder = 1;

const squareDimPressed = 10;
const squareBorderPressed = 0.25;

const styles = scale => {
  const sideOutScaled = (squareDim + 2 * squareBorder) * scale;
  const sideInScaled = squareDimPressed * scale;

  const squareDimScaled = squareDim * scale;
  const squareBorderScaled = squareBorder* scale;

  const squareDimPressedScaled = squareDimPressed * scale;
  const squareBorderPressedScaled = squareBorderPressed * scale;

  return StyleSheet.create({
    button: {
      position: 'absolute',
      height: sideOutScaled,
      width: sideOutScaled,
    },
    square: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.greyMain,
      height: squareDimScaled,
      width: squareDimScaled,
      top: squareBorderScaled,
      left: squareBorderScaled,
    },
    triangleCorner: {
      width: 0,
      height: 0,
      backgroundColor: colors.greyShade,
      borderStyle: 'solid',
      borderRightWidth: sideOutScaled,
      borderTopWidth: sideOutScaled,
      borderRightColor: 'transparent',
      borderTopColor: colors.greyLight,
    },
    squarePressed: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.greyMain,
      height: squareDimPressedScaled,
      width: squareDimPressedScaled,
      borderWidth: squareBorderPressedScaled,
      borderColor: colors.greyShade,
    },
    squarePressedExploded: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.red2,
      height: squareDimPressedScaled,
      width: squareDimPressedScaled,
      borderWidth: squareBorderPressedScaled,
      borderColor: colors.greyShade,
    },
    nMines: {
      fontFamily: 'easports',
      fontSize: squareDimScaled,
    },
    question: {
      fontFamily: 'coolvetica',
      fontSize: squareDimScaled,
      color: 'black',
    },
    iconCross: {
      width: squareDimPressedScaled - 2 * squareBorderPressedScaled,
      height: squareDimPressedScaled - 2 * squareBorderPressedScaled,
    },
    iconMine: {
      width: squareDimScaled,
      height: squareDimScaled,
    },
    iconFlag: {
      width: squareDimScaled - 2 * scale,
      height: squareDimScaled - 2 * scale,
    },
  })
}

AppRegistry.registerComponent('MineSweeperTest', () => MineSweeperTest);
