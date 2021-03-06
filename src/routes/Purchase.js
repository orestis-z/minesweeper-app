import React, { Component } from "react";
import { Alert, View, ScrollView, Text } from "react-native";
import { Button as _Button } from "react-native-elements";
import Device from "react-native-device-detection";

// redux
import { connect } from "react-redux";

// lib
import { getForm, errorHandle, normalize, inAppPurchase } from "src/lib";

// config
import { store, params } from "src/config";

const fontSize = normalize(14);
const inAppPurchases = params.inAppPurchases;
const donate = params.donate;

const purchase = i =>
  inAppPurchase
    .open()
    .then(() => inAppPurchase.purchase(i))
    .then(inAppPurchase.isPurchased)
    .then(
      ({ purchased, purchaseList }) =>
        purchased &&
        store.dispatch({
          type: "PURCHASED",
          payload: { purchased, purchaseList },
        }),
    )
    .then(inAppPurchase.close)
    .catch(inAppPurchase.close);
// .catch(err => {errorHandle(err); inAppPurchase.close()}); // testing

class Button extends Component {
  render() {
    return (
      <_Button
        buttonStyle={{
          margin: 10,
          borderRadius: 4,
        }}
        fontFamily="win95"
        // fontWeight={ Device.isIos && 'bold' }
        backgroundColor="#4E82A7"
        // color='#E8D5B7'
        {...this.props}
      />
    );
  }
}

const motivationText = `
Looks like you are enjoying Minesweeper.
As a student I do my best to keep this application ad-free and up-to-date.
Therefore I would like to kindly ask you to support me.
`;

const motivationText2 = `
Looks like you are enjoying Minesweeper.
As a student I do my best to keep this application good-looking and up-to-date.
Therefore I would like to kindly ask you to support me which will also remove the ads.
`;

export default
@connect(store => ({
  gameCounter: store.general.gameCounter,
  purchased: store.general.purchased,
  purchaseList: store.general.purchaseList,
}))
class Purchase extends Component {
  donate() {
    Alert.alert("Thanks for your support!");
    getForm("https://www.paypal.com/cgi-bin/webscr", {
      business: "orestis.zambounis@gmail.com",
      cmd: "_donations",
      item_name: "Orestis Zambounis",
      item_number: "Minesweeper",
      currency_code: "USD",
    }).catch(err => errorHandle(err));
    this.props.close();
  }

  constructor(props) {
    super(props);

    inAppPurchase
      .open()
      .then(inAppPurchase.isPurchased)
      .then(
        ({ purchased, purchaseList }) =>
          purchased &&
          store.dispatch({
            type: "PURCHASED",
            payload: { purchased, purchaseList },
          }),
      )
      .then(inAppPurchase.close)
      .catch(inAppPurchase.close);
    // .catch(err => {errorHandle(err); inAppPurchase.close()}); // testing
  }

  render() {
    const { purchaseList } = this.props;
    return (
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.08)",
        }}
      >
        <View
          style={{
            marginTop: 10,
            marginBottom: 0,
            marginLeft: 30,
            marginRight: 30,
          }}
        >
          {this.props.purchased ||
          this.props.gameCounter < params.adFactor * params.purchaseInterval ? (
            <Text
              style={{
                color: "black",
                textAlign: "center",
                fontSize,
                fontFamily: "win95",
              }}
            >
              {motivationText}
            </Text>
          ) : (
            <Text
              style={{
                color: "black",
                textAlign: "center",
                fontSize,
              }}
            >
              <Text style={{ fontFamily: "win95" }}>{motivationText2}</Text>
            </Text>
          )}
          <Text
            style={{
              textAlign: "center",
              color: "black",
              fontSize,
              fontFamily: "win95",
              marginBottom: 20,
            }}
          >
            You can pay what you want:
          </Text>
        </View>
        {inAppPurchases ? (
          <View style={{ marginBottom: 20 }}>
            {purchaseList.reverse().map((isPurchased, i) => {
              const j = purchaseList.length - i;
              return !isPurchased ? (
                <Button
                  key={i}
                  title={"USD " + j + ".00"}
                  onPress={() => {
                    this.props.close();
                    purchase(j);
                  }}
                />
              ) : null;
            })}
            <Button title="USD 0.00" onPress={() => this.props.close()} />
          </View>
        ) : null}
        {inAppPurchases && donate ? (
          <Text
            style={{
              textAlign: "center",
              color: "black",
              fontSize,
            }}
          >
            or
          </Text>
        ) : null}
        {donate ? (
          <Button
            title="Donate"
            onPress={this.donate.bind(this)}
            // buttonStyle={ {
            //   marginTop: 10,
            //   marginBottom: 10,
            //   borderRadius: 20,
            // } }
          />
        ) : null}
      </ScrollView>
    );
  }
}
