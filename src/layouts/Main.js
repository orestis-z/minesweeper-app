import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import {
  Dimensions,
} from 'react-native';
import Orientation from 'react-native-orientation';
import Device from 'react-native-device-detection';

// config
import { store } from 'src/config';

// routes
import {
  Main as MainScene,
  Loading,
} from 'src/routes'

// redux
import { connect } from 'react-redux';

// lib
import {
  errorHandle,
  inAppPurchase,
} from 'src/lib';

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

if (Device.isTablet)
  Orientation.lockToLandscape();
else
  Orientation.lockToPortrait();

Dimensions.addEventListener('change', _orientationDidChange);

_orientationDidChange({window: Dimensions.get('window')});

const logoMinTime = __DEV__ ? 0 : 2;

@connect( store => ({
    loaded: store.general.loaded,
    purchased: store.general.purchased,
}))
export default class Main extends Component {
    state = { timeOver: false }

    componentWillMount() {
        setTimeout(() => this.setState({timeOver: true}), logoMinTime * 1000);
    }

    componentWillUpdate(nextProps, nextState) {
      if (nextProps.loaded && nextState.timeOver && !nextProps.purchased)
        inAppPurchase.open()
        .then(inAppPurchase.isPurchased)
        .then(({purchased, purchaseList}) => purchased && nextProps.dispatch({
          type: 'PURCHASED',
          payload: {purchased, purchaseList},
        }))
        .then(inAppPurchase.close)
        .catch(err => {errorHandle(err); inAppPurchase.close()});
        // .catch(inAppPurchase.close)
      // else
      //   inAppPurchase.consumeAll() // testing
      //   .then(() => store.dispatch({type: 'PURCHASED', payload: {purchased: false, purchaseList: [false, false, false, false, false]}})) // testing
    }

    render() {
        return (
          <View
            style={ {flex: 1} }
          >
            { this.props.loaded && this.state.timeOver ?
              <MainScene/>
            :
              <Loading/>
            }
          </View>
        )
    }
};
