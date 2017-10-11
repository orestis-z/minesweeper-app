import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  Platform,
  View,
  Vibration,
} from 'react-native';
import _ from 'lodash';

import colors from 'src/colors';

// components
import {
  Touchable,
} from 'src/components';

// images
import {
  crossImage,
  flagImage,
  mineImage,
} from 'src/assets/images';

// redux
import { connect } from 'react-redux';

const longPressTime = 5;
let inputMode = 0;

@connect()
class Button extends Component {
  pressDuration = 0;

  reveal = () => {
    this.props.mines.reveal([this.props.i, this.props.j]);
    this.props.dispatch({
      type: 'MINE_FIELD_CONFIG',
      payload: this.props.mines.mineField(),
    });
  }
  mark = () => this.props.mines.mark([this.props.i, this.props.j])

  shouldComponentUpdate(nextProps) {
    return (
      this.props.mark != nextProps.mark ||
      this.props.scale != nextProps.scale
    );
  }

  onLongPress() {
    this.props.dispatch({
      type: 'HIGHLIGHT',
      payload: true,
      pos: {x: this.props.x, y: this.props.y},
    });
    setTimeout(() => this.props.dispatch({
      type: 'HIGHLIGHT',
      payload: false,
    }), 100);
  }

  render() {
    const { mark, styles } = this.props;

    return (
      <Touchable
        onPress={ () => inputMode ? this.mark() : this.reveal() } 
        onLongPress={ () => {this.onLongPress(); inputMode ? this.reveal() : this.mark()} }
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
      </Touchable>
    );
  }
}

class ButtonPressed extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      this.props.nMines != nextProps.nMines  ||
      this.props.scale != nextProps.scale
    );
  }
  render() {
    const { nMines, styles } = this.props;

    return (
      <View
        style={ [styles.buttonPressed,
          {
            position: 'absolute',
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

@connect(store => ({
  windowSize: store.general.windowSize,
  gameState: store.game.gameState,
  inputMode: store.game.inputMode,
  cellStates: store.game.cellStates,
  dims: store.game.dims,
  highlight: store.game.highlight,
}))
export default class Board extends Component {
  scale = 1;

  constructor(props) {
    super(props);
    this.init(props);

    const { dims, mines } = props; 

    for (let i = 0; i < dims.dimensions[0]; i++) {
      for (let j = 0; j < dims.dimensions[1]; j++) {
        if (!isNaN(props.cellStates[i + ',' + j]))
          mines.reveal([i, j]);
        else if (props.cellStates[i + ',' + j] === 'MARKED')
          mines.mark([i, j]);
      }
    }
  }

  reset(props) {
    const { dims } = props;

    let cellStates = {};
    for (let i = 0; i < dims.dimensions[0]; i++) {
      for (let j = 0; j < dims.dimensions[1]; j++) {
        cellStates[i + ',' + j] = undefined;
      }
    }
    props.dispatch({
      type: 'SET_CELL_STATES',
      payload: cellStates,
    })
  }

  init(props) {
    const { mines, dims, gameState } = props;

    this.rangeX = _.range(dims.dimensions[0]);
    this.rangeY = _.range(dims.dimensions[1]);

    mines.onCellStateChange((cell, state) => {
      props.dispatch({
        type: 'CELL_STATE_CHANGE',
        payload: state,
        i: cell[0],
        j: cell[1],
      })
    });

    this.buttonSize = props.dims.buttonSize;
    this.scale = this.buttonSize / (squareDim + 2 * squareBorder);
    this.styles = styles(this.scale);
  }

  componentWillUpdate(nextProps) {
    if (
      nextProps.mines.mine_count !== this.props.mines.mine_count ||
      nextProps.dims.dimensions[0] !== this.props.dims.dimensions[0] ||
      nextProps.dims.dimensions[1] !== this.props.dims.dimensions[1] ||
      nextProps.dims.buttonSize !== this.props.dims.buttonSize
    ) {
      this.reset(nextProps);
      this.init(nextProps);
    }
  }

  componentWillReceiveProps(nextProps) {
    inputMode = nextProps.inputMode;
  }

  render() {
    const { windowSize, highlight } = this.props;
    return (
      <View
        style={ {
          backgroundColor: colors.greyShade,
          height: windowSize.height,
          width: windowSize.width,
        } }
      >
        { this.rangeX.map(i =>
          this.rangeY.map(j => {
            const cellState = this.props.cellStates[i + ',' + j];

            if (isNaN(cellState))
              return (
                <Button
                  mines={ this.props.mines }
                  styles={ this.styles }
                  scale={ this.scale }
                  x={ this.buttonSize * j }
                  y={ this.buttonSize * i }
                  i={ i }
                  j={ j }
                  mark={ cellState }
                />
              )
            else
              return (
                <ButtonPressed
                  styles={ this.styles }
                  scale={ this.scale }
                  x={ this.buttonSize * j }
                  y={ this.buttonSize * i }
                  nMines={ cellState }
                />
              )
          })
        ) }
        { highlight.on ?
          <View
            style={ {
              position: 'absolute',
              top: highlight.pos.y - this.buttonSize,
              left: highlight.pos.x - this.buttonSize,
              backgroundColor: 'white',
              height: this.buttonSize * 3,
              width: this.buttonSize * 3,
              opacity: 0.2,
            } }
          />
        :
          null
        }
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
      borderWidth: Platform.OS === 'android' ? squareBorderPressedScaled : 1,
      borderColor: colors.greyShade,
    },
    squarePressedExploded: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.red2,
      height: squareDimPressedScaled,
      width: squareDimPressedScaled,
      borderWidth: Platform.OS === 'android' ? squareBorderPressedScaled : 1,
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
