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
  state={ game: 'NOT_STARTED' }
  mines = minesLogic.create({preset: 'beginner'});

  constructor(props) {
    super(props);
    this.mines.onGameStateChange((state, oldState) => {
        if(state != oldState)
          this.setState({game: state})
      }
    );
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
          gameState={ this.state.game }
          dims={ this.dims }
        />
        <Separator
          width={ this.dims.width }/>
        <Board
          mines={ this.mines }
          dims={ this.dims }
        />
      </View>
    );
  }
}
