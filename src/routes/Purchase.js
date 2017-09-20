import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';
import { Button as _Button } from 'react-native-elements'
import InAppBilling from 'react-native-billing';

const purchase = () =>
  InAppBilling.open()
    .then(() => InAppBilling.purchase('android.test.purchased'))
    .then((details) => {
      console.log("You purchased: ", details)
      return InAppBilling.close()
    })
    .catch((err) => {
      console.log(err);
    });

class Button extends Component {
  render () {
    return (
      <_Button
        buttonStyle={ {
          marginTop: 10,
          borderRadius: 20,
        } }
        // fontFamily='monospace'
        backgroundColor='#0E2431'
        color='#E8D5B7'
        {...this.props}
      />
    )
  }
}

export default class Purchase extends Component {
  render () {
    return (
      <View
        style={ {
          flex: 1,
          // justifyContent: 'space-between',
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
            } }
          >
            Looks like you are enjoying Minesweeper.{'\n'}So we would like to kindly ask you to support us.
          </Text>
          <Text style={ {
              textAlign: 'center',
              marginTop: 10,
              color:'black'
            } }
          >
            You can pay what you want:
          </Text>
        </View>
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
        <Text
          style={ {
            textAlign: 'center',
            marginTop: 10,
            color:'black',
          } }
        >
          or
        </Text>
        <Button
          title='Donate' 
          // backgroundColor='#03051E'
        />
      </View>
    )
  }
};
