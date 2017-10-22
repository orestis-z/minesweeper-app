import InAppBilling from 'react-native-billing';

let purchaseList = [];

const _isPurchased = i => {
  if (i > 5) {
    purchaseList = [];
    return Promise.resolve();
  }
  else {
    return _isPurchased(i + 1)
    .then(() => InAppBilling.isPurchased('com.kima.minesweeper.support_0' + i))
    .then(purchased => purchaseList.push(purchased) && purchaseList);
  }
}

export const open = InAppBilling.open;
export const close = InAppBilling.close;

export const purchase = i => InAppBilling.purchase('com.kima.minesweeper.support_0' + i);

export const isPurchased = () => 
  _isPurchased(1)
  .then(purchaseList => console.log('=====' + purchaseList) || purchaseList) // testing
  .then(purchaseList => ({
    purchased: purchaseList.some(x => x),
    purchaseList,
  }));

export const consume = i =>
  InAppBilling.consumePurchase('com.kima.minesweeper.support_0' + i)

const _consumeAll = i => {
  if (i > 5)
    return Promise.resolve();
  else {
    return _consumeAll(i + 1)
    .then(() => InAppBilling.consumePurchase('com.kima.minesweeper.support_0' + i))
    .catch(err => err);//console.log(err))
  }
}

export const consumeAll = i =>
  _consumeAll(1);
