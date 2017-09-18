import React, { Component } from 'react';
import {
  Dimensions,
  View,
} from 'react-native';
import minesLogic from 'mines';

import Board from './Board';
import Header from './Header';

import colors from 'src/colors';

const separatorBorder = 4;
const separatorWdith = 9;

class Separator extends Component {
  render() {
    const { width } = this.props;

    return (
      <View>
        <View
          style={ {
            width: width,
            height: separatorBorder,
            backgroundColor:colors.greyLight,
          } }
        />
        <View
          style={ {
            width: width,
            height: separatorWdith,
            backgroundColor:colors.greyMain,
          } }
        />
        <View
          style={ {
            width: width,
            height: separatorBorder,
            backgroundColor:colors.greyShade,
          } }
        />
      </View>
    )
  }
}

export default class Main extends Component {
  mines = minesLogic.create({preset: 'beginner'});
  state = {
    game: 'NOT_STARTED',
    time: 0, inputMode: 0,
    mineCount: this.mines.mine_count,
  };

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

  constructor(props) {
    super(props);
    this.mines.onGameStateChange((state, oldState) => {
      if(state != oldState) {
        this.setState({game: state})
        if(oldState == 'NOT_STARTED' && state == 'STARTED') {
          this.restartTimer();
        }
        if(state == 'WON' || state == 'LOST')
          this.stopTimer();
        if(state == 'NOT_STARTED') {
          this.setState({time: 0});
          this.stopTimer();
        }
      }
    });

    this.mines.onRemainingMineCountChange(mineCount => this.setState({mineCount}))
  }

  componentWillMount() {
    this.dims = Dimensions.get('window');
  }

  render() {
    return (
      <View>
        <Separator
          width={ this.dims.width }
        />
        <Header
          mines={ this.mines }
          mineCount={ this.state.mineCount }
          gameState={ this.state.game }
          dims={ this.dims }
          time={ this.state.time }
          inputMode={ this.state.inputMode }
          changeInputMode={ () => this.setState({inputMode: !this.state.inputMode}) }
        />
        <Separator
          width={ this.dims.width }/>
        <Board
          mines={ this.mines }
          dims={ this.dims }
          inputMode={ this.state.inputMode }
        />
      </View>
    );
  }
}
