import React, { Component } from 'react';
import {
  View,
  Vibration,
} from 'react-native';
import minesLogic from 'mines';

import Board from './Board';
import Header, { headerHeight } from './Header';
import Menu from './Menu';

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

@connect( store => ({
    windowSize: store.general.windowSize,
    fieldSize: store.general.fieldSize,
    level: store.general.level,
    vibrate: store.general.vibrate,
}))
export default class Main extends Component {
  static navigationOptions = {
    header: null,
  };
  
  state = {
    game: 'NOT_STARTED',
    time: 0,
    inputMode: 0,
  };

  getDimensions(props) {
    const { windowSize, fieldSize } = props;
    const nFields1 = 5 + fieldSize * 2;
    const availableLength = windowSize.height - 2 * separatorWidth - headerHeight - minMenuHeight;
    const buttonSize = windowSize.width / nFields1;
    const nFields2 = Math.floor(availableLength / buttonSize);

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
    if (nextProps.fieldSize !== this.props.fieldSize || nextProps.level !== this.props.level){
      this.setState({...this.initMines(nextProps)});
    }
  }

  render() {
    return (
      <View>
        <Menu
          height={ this.state.delta + minMenuHeight }
          navigation={ this.props.navigation }
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
      </View>
    );
  }
}
