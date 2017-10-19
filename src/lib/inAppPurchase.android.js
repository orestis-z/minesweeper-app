import InAppBilling from 'react-native-billing';

let purchaseList = [];

const _isPurchased = (i) => {
  if (i > 5)
    return Promise.resolve();
  else {
    return _isPurchased(i + 1)
    .then(() =>
      InAppBilling.isPurchased('com.kima.minesweeper.support_0' + i)
      .then(purchased => purchaseList.push(purchased))
    )
  }
}

export const isPurchased = () => 
  InAppBilling.open()
  .then(() => _isPurchased(1))
  .then(() => InAppBilling.close())
  .then(() => purchaseList.some(x => x))
