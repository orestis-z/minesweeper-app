import React, { Component } from 'react';
import {
  Alert,
  View,
  ScrollView,
  Text,
} from 'react-native';
import { Button as _Button } from 'react-native-elements'
import InAppBilling from 'react-native-billing';
import Device from 'react-native-device-detection';

// redux
import { connect } from 'react-redux';

// lib
import {
  getForm,
  errorHandle,
  normalize,
} from 'src/lib';

// config
import { store, params } from 'src/config';

const fontSize = normalize(14);
const inAppPurchases = params.inAppPurchases;
const donate = params.donate;

const purchase = i =>
  InAppBilling.open()
  .then(() => InAppBilling.purchase('com.kima.minesweeper.support_0' + i))
  .then(details => InAppBilling.close())
  .then(() => inAppPurchase.isPurchased(purchased => purchased && store.dispatch({type: 'PURCHASED'})))
  .catch(err => InAppBilling.close());

class Button extends Component {
  render () {
    return (
      <_Button
        buttonStyle={ {
          margin: 10,
          borderRadius: 20,
        } }
        fontFamily={ Device.isAndroid ? 'monospace' : 'Avenir Next' }
        // fontWeight={ Device.isIos && 'bold' }
        backgroundColor='#4E82A7'
        // color='#E8D5B7'
        {...this.props}
      />
    )
  }
}

const motivationText = `
Looks like you are enjoying Minesweeper.
As a student I do my best to keep this application ad-free and up-to-date.
Therefore I would like to kindly ask you to support me.
`

const motivationText2 = `
Looks like you are enjoying Minesweeper.
As a student I do my best to keep this application good-looking and up-to-date.
Therefore I would like to kindly ask you to support me which will also remove the ads.
`

@connect(store => ({
  gameCounter: store.general.gameCounter,
  purchased: store.general.purchased,
}))
export default class Purchase extends Component {
  donate() {
    Alert.alert('Thanks for your support!');
    getForm("https://www.paypal.com/cgi-bin/webscr", {
      business: 'orestis.zambounis@gmail.com',
      cmd:'_donations',
      item_name:'Orestis Zambounis',
      item_number:'Minesweeper',
      currency_code:'USD',
    }).catch(err => errorHandle(err))
    this.props.close();
  }

  render () {
    return (
      <ScrollView
        style={ {
          flex: 1,
        } }
      >
        <View
          style={ {
            marginTop: 10,
            marginBottom: 0,
            marginLeft: 30,
            marginRight: 30,
          } }
        >
          <Text style={ {
              color:'black',
              textAlign: 'center',
              fontSize,
            } }
          >
            { this.props.purchased ||
              this.props.gameCounter < params.adFactor * params.purchaseInterval ?
              motivationText : motivationText2 }
          </Text>
          <Text style={ {
              textAlign: 'center',
              // marginTop: 5,
              color:'black',
              fontSize,
            } }
          >
            You can pay what you want:
          </Text>
        </View>
        { inAppPurchases ?
          <View>
           { [1, 2, 3, 4, 5].map(i =>
                <Button
                  key={ i }
                  title={ 'USD ' + i + '.00' }
                  onPress={ () => { this.props.close(); purchase(i);} }
                />
              )
            }
            <Button
              title='USD 0.00'
              onPress={ () => this.props.close() }
            />
          </View>
        :
          null
        }
        { inAppPurchases && donate ?
          <Text
            style={ {
              textAlign: 'center',
              color:'black',
              fontSize,
            } }
          >
            or
          </Text>
        :
          null
        }
        { donate ?
          <Button
            title='Donate' 
            onPress={ this.donate.bind(this) }
            // buttonStyle={ {
            //   marginTop: 10,
            //   marginBottom: 10,
            //   borderRadius: 20,
            // } }
          />
        :
          null
        }
      </ScrollView>
    )
  }
};
