import React, { Component } from 'react';
import {
  View,
  Vibration,
} from 'react-native';
import Modal from 'react-native-modal';
import Device from 'react-native-device-detection';

import Board from './Board';
import Header, { headerHeight } from './Header';
import Menu from './Menu';
import Purchase from './Purchase';

// redux
import { connect } from 'react-redux';

// lib
import { minesLogic, normalize } from 'src/lib';

// config
import { params } from 'src/config';

import colors from 'src/colors';

const separatorBorderWidth = 4;
const separatorInlineWdith = 9;
const separatorWidth = separatorInlineWdith + 2 * separatorBorderWidth;

@connect( store => ({
    windowSize: store.general.windowSize,
}))
class Separator extends Component {
  render() {
    const { width } = this.props.windowSize;

    return (
      <View>
        <View
          style={ {
            width: width,
            height: separatorBorderWidth,
            backgroundColor:colors.greyLight,
          } }
        />
        <View
          style={ {
            width: width,
            height: separatorInlineWdith,
            backgroundColor:colors.greyMain,
          } }
        />
        <View
          style={ {
            width: width,
            height: separatorBorderWidth,
            backgroundColor:colors.greyShade,
          } }
        />
      </View>
    )
  }
}

const minMenuHeight = normalize(20);
const levelFactor = params.levelFactor;;
const purchaseInterval = params.purchaseInterval;;

@connect(store => ({
  windowSize: store.general.windowSize,
  orientation: store.general.orientation,
  fieldSize: store.general.fieldSize,
  level: store.general.level,
  vibrate: store.general.vibrate,
  gameCounter: store.general.gameCounter,
  purchased: store.general.purchased,
  gameState: store.game.gameState,
  time: store.game.time,
  inputMode: store.game.inputMode,
  mineField: store.game.mineField,
  dims: store.game.dims,
}))
export default class Main extends Component {
  static navigationOptions = {
    header: null,
  };
  
  state = {
    counter: 0,
    requestedPurchase: false,
  };

  getNFields(fieldSize) {
    if (Device.isTablet)
      return 8 + fieldSize * 4;
    else
      return 5 + fieldSize * 2;
  }

  getDimensions(props) {
    const { windowSize, fieldSize, orientation } = props;
    let buttonSize, nFields1, nFields2;
    const availableHeight = windowSize.height - 2 * separatorWidth - headerHeight - minMenuHeight;

    if (orientation === 'PORTRAIT') {
      nFields1 = this.getNFields(fieldSize);
      buttonSize = windowSize.width / nFields1;
      nFields2 = Math.floor(availableHeight / buttonSize);
    }
    else {
      nFields2 = Math.ceil(availableHeight / windowSize.height * this.getNFields(fieldSize));
      const buttonSizeTemp = availableHeight / nFields2;
      nFields1 = Math.ceil(windowSize.width / buttonSizeTemp);
      buttonSize = windowSize.width / nFields1;
    }

    return {
      buttonSize,
      dimensions: [nFields2, nFields1],
      delta: availableHeight - nFields2 * buttonSize,
    };
  }

  startTimer = () => {
    this.timerId = setInterval(() => 
      this.props.dispatch({
        type: 'TIME_CHANGE',
        payload: this.props.time + 1,
      }), 1000);
  }

  stopTimer = () => clearInterval(this.timerId);

  clearTimer = () => {
    this.stopTimer();
    this.props.dispatch({
      type: 'TIME_CHANGE',
      payload: 0,
    });
  };

  restartTimer = () => {
    this.clearTimer();
    this.startTimer();
  }

  initMines(props, mount=true) {
    const dims = this.getDimensions(props);
    const nMines = Math.round(levelFactor[props.level] * dims.dimensions[0] * dims.dimensions[1])
    const mines = minesLogic.create({
      dimensions: dims.dimensions,
      mine_count: nMines,
      mines: mount ? props.mineField : null,
    });

    mines.onGameStateChange((state, oldState) => {
      if (state != oldState) {
        this.props.dispatch({
          type: 'GAME_STATE_CHANGE',
          payload: state,
        });
        if(oldState == 'NOT_STARTED' && state == 'STARTED') {
          this.startTimer();
        }
        if(state == 'WON' || state == 'LOST')
          this.stopTimer();
        if(this.props.vibrate && state == 'WON')
          Vibration.vibrate([0, 200, 100, 200, 100, 500]);
        if(this.props.vibrate && state == 'LOST')
          Vibration.vibrate();
        if(state == 'NOT_STARTED') {
          this.props.dispatch({
            type: 'TIME_CHANGE',
            payload: 0,
          });
          this.stopTimer();
        }
      }
    });

    if (!mount)
      this.clearTimer();

    mines.onRemainingMineCountChange(mineCount => props.dispatch({
      type: 'MINE_COUNT_CHANGE',
      payload: mineCount,
    }));

    props.dispatch({
      type: 'SET_STATE',
      payload: {
        mineCount: mines.mine_count,
        dims,
      }
    })

    return mines;
  }

  constructor(props) {
    super(props);
    this.state.mines = this.initMines(props);
  }

  componentWillUpdate(nextProps) {
    if (
      nextProps.fieldSize !== this.props.fieldSize ||
      nextProps.level !== this.props.level ||
      nextProps.windowSize.width !== this.props.windowSize.width ||
      nextProps.windowSize.height !== this.props.windowSize.height
    ) {
      this.setState({mines: this.initMines(nextProps, false)});
    }
  }

  render() {
    return (
      <View>
        <Menu
          height={ this.props.dims.delta + minMenuHeight }
          purchase={ () => this.setState({requestedPurchase: true}) }
        />
        <Separator/>
        <Header
          mines={ this.state.mines }
          clearTimer={ this.clearTimer }
        />
        <Separator/>
        <Board
          mines={ this.state.mines }
        />
        <Modal
          isVisible={ 
            this.state.requestedPurchase ||
            (
              !this.props.purchased &&
              this.props.gameCounter < params.adFactor * params.purchaseInterval && 
              (this.props.gameCounter + this.state.counter) % purchaseInterval === 0)
          }
        >
          <View
            style={ {
              flex: 1,
              backgroundColor: 'white',
            } }
          >
            <Purchase
              close={ () => this.setState({
                counter: this.state.requestedPurchase ? this.state.counter : this.state.counter + 1,
                requestedPurchase: false,
              }) }
            />
          </View>
        </Modal>
      </View>
    );
  }
}
