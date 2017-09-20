import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import {
  Dimensions,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Orientation from 'react-native-orientation';

// config
import { store } from 'src/config';

// routes
import {
    Main as MainScene,
    Loading,
    // Donate,
} from 'src/routes'

// redux
import { connect } from 'react-redux';

const _orientationDidChange = ({ window: { width, height } }) => {
    const orientation = width > height ? 'LANDSCAPE' : 'PORTRAIT';

    store.dispatch({
    type: 'ORIENTATION_CHANGE',
    payload: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      orientation,
    }
  })
}

Orientation.lockToPortrait();

Dimensions.addEventListener('change', _orientationDidChange);

_orientationDidChange({window: Dimensions.get('window')});

const logoMinTime = 2;

const MainSceneNavigator = StackNavigator(
  {
  Main: { screen: MainScene },
  // Donate: { screen: Donate },
  },
  {
    headerMode: 'screen',
  }
)

@connect( store => ({
    loaded: store.general.loaded,
}))
export default class Main extends Component {
    state = { timeOver: false }

    componentWillMount() {
        setTimeout(() => this.setState({timeOver: true}), logoMinTime * 1000);
    }

    render() {
        return (
          <View
            style={ {flex: 1} }
          >
            { this.props.loaded && this.state.timeOver ?
              <MainSceneNavigator/>
            :
              <Loading/>
            }
          </View>
        )
    }
};
