import InAppBilling from 'react-native-billing';

InAppBilling.open()
.then(() => InAppBilling.purchase('android.test.purchased'))
.then((details) => {
  console.log("You purchased: ", details)
  return InAppBilling.close()
})
.catch((err) => {
  console.log(err);
});

