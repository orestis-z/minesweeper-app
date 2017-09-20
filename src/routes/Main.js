import React, { Component } from 'react';
import {
  View,
  Vibration,
} from 'react-native';
import minesLogic from 'mines';
import Modal from 'react-native-modal'

import Board from './Board';
import Header, { headerHeight } from './Header';
import Menu from './Menu';
import Purchase from './Purchase';

// redux
import { connect } from 'react-redux';

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

const minMenuHeight = 20;
const levelFactor = [0.12, 0.16, 0.21];
const purchaseInterval = 10;

@connect( store => ({
    windowSize: store.general.windowSize,
    orientation: store.general.orientation,
    fieldSize: store.general.fieldSize,
    level: store.general.level,
    vibrate: store.general.vibrate,
    gameCounter: store.general.gameCounter,
    purchased: store.general.purchased,
}))
export default class Main extends Component {
  static navigationOptions = {
    header: null,
  };
  
  state = {
    counter: 0,
    requestPurchase: false,
  };

  getDimensions(props) {
    const { windowSize, fieldSize, orientation } = props;
    let buttonSize, nFields1, nFields2;
    const availableLength = windowSize.height - 2 * separatorWidth - headerHeight - minMenuHeight;

    if (orientation === 'PORTRAIT') {
      nFields1 = 5 + fieldSize * 2;
      buttonSize = windowSize.width / nFields1;
      nFields2 = Math.floor(availableLength / buttonSize);
    }
    else {
      nFields2 = 5 + fieldSize * 2;
      const buttonSizeTemp = availableLength / nFields2;
      nFields1 = Math.ceil(windowSize.width / buttonSizeTemp);
      buttonSize = windowSize.width / nFields1;
    }

    return {
      buttonSize,
      dimensions: [nFields2, nFields1],
      delta: availableLength - nFields2 * buttonSize,
    };
  }

  startTimer = () => {
    this.timerId = setInterval(() => 
      this.setState({time: this.state.time + 1}), 1000);
  }

  stopTimer = () => clearInterval(this.timerId);

  restartTimer = () => {
    this.stopTimer();
    this.setState({time: 0});
    this.startTimer();
  }

  initMines(props) {
    const dims = this.getDimensions(props);
    const mines = minesLogic.create({
      dimensions: dims.dimensions,
      mine_count: Math.round(levelFactor[props.level] * dims.dimensions[0] * dims.dimensions[1]),
    });

    mines.onGameStateChange((state, oldState) => {
      if(state != oldState) {
        this.setState({game: state})
        if(oldState == 'NOT_STARTED' && state == 'STARTED') {
          this.restartTimer();
        }
        if(state == 'WON' || state == 'LOST')
          this.stopTimer();
        if(this.props.vibrate && state == 'WON')
          Vibration.vibrate([0, 200, 100, 200, 100, 500]);
        if(this.props.vibrate && state == 'LOST')
          Vibration.vibrate();
        if(state == 'NOT_STARTED') {
          this.setState({time: 0});
          this.stopTimer();
        }
      }
    });

    mines.onRemainingMineCountChange(mineCount => this.setState({mineCount}));

    return {
      ...this.state,
      game: 'NOT_STARTED',
      time: 0,
      inputMode: 0,
      ...dims,
      mines,
      mineCount: mines.mine_count,
    };
  }

  constructor(props) {
    super(props);
    this.state = this.initMines(props);
  }

  componentWillUpdate(nextProps) {
    if (
      nextProps.fieldSize !== this.props.fieldSize ||
      nextProps.level !== this.props.level ||
      nextProps.windowSize.width !== this.props.windowSize.width ||
      nextProps.windowSize.height !== this.props.windowSize.height
    ) {
      this.setState({...this.initMines(nextProps)});
    }
  }

  render() {
    return (
      <View>
        <Menu
          height={ this.state.delta + minMenuHeight }
          purchase={ () => this.setState({requestPurchase: true}) }
          // navigation={ this.props.navigation }
        />
        <Separator/>
        <Header
          mines={ this.state.mines }
          mineCount={ this.state.mineCount }
          gameState={ this.state.game }
          time={ this.state.time }
          inputMode={ this.state.inputMode }
          changeInputMode={ () => this.setState({inputMode: !this.state.inputMode}) }
        />
        <Separator/>
        <Board
          mines={ this.state.mines }
          inputMode={ this.state.inputMode }
          buttonSize={ this.state.buttonSize }
          dimensions={ this.state.dimensions }
        />
        <Modal
          isVisible={ 
            this.state.requestPurchase ||
            (!this.props.purchased && (this.props.gameCounter + this.state.counter) % purchaseInterval === 0)
          }
        >
          <View
            style={ {
              flex: 1,
              backgroundColor: 'white',
            } }
          >
            <Purchase
              close={ () => this.setState({counter: this.state.counter + 1, requestPurchase: false}) }
            />
          </View>
        </Modal>
      </View>
    );
  }
}
