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

// lib
import {
  getForm,
  errorHandle,
  normalize,
} from 'src/lib';

const fontSize = normalize(14);
const inAppPurchase = true;
const donate = false;

const purchase = () =>
  InAppBilling.open()
    .then(() => InAppBilling.purchase('minesweeper_5.00'))
    .then(details => {
      console.log("You purchased: ", details)
      return InAppBilling.close()
    })
    .catch(err => {
      console.log(err);
      return InAppBilling.close()
    });

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
            { motivationText }
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
        { inAppPurchase ?
          <View>
            <Button
              title='USD 1.00'
              onPress={ () => purchase(1) }
            />
            <Button
              title='USD 2.00'
              onPress={ () => purchase(2) }
            />
            <Button
              title='USD 3.00'
              onPress={ () => purchase(3) }
            />
            <Button
              title='USD 4.00'
              onPress={ () => purchase(4) }
            />
            <Button
              title='USD 5.00'
              onPress={ () => purchase(5) }
            />
            <Button
              title='USD 0.00'
              onPress={ () => this.props.close() }
            />
          </View>
        :
          null
        }
        { inAppPurchase && donate ?
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
