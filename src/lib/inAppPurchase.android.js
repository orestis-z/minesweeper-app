import InAppBilling from 'react-native-billing';

let purchaseList = [];

const _isPurchased = i => {
  if (i == 0) {
    purchaseList = [];
    return Promise.resolve();
  }
  else {
    return _isPurchased(i - 1)
    .then(() => InAppBilling.isPurchased('com.kima.minesweeper.support_0' + i))
    .then(purchased => purchaseList.push(purchased) && purchaseList);
  }
}

export const open = InAppBilling.open;
export const close = InAppBilling.close;

export const purchase = i => purchaseProduct('com.kima.minesweeper.support_0' + i);

const getErrorMessage = code => `Purchase or subscribe failed with error: ${code}`;

async function purchaseProduct(id) {
  const response = await new Promise((resolve, reject) => {
    let repurchaseTries = 0;
    const maxRepurchaseTries = 2;

    async function purchaseFn() {
      try {
        const res = await InAppBilling.purchase(id);
        resolve(res);
      }
      catch (err) {
        if (err.message === getErrorMessage(1)) {
          reject({
            code: 'USER_CANCELED_PURCHASE',
            id,
          });
            // This is a workaround for some bug that happens saying the signature is invalid but
            // the purchase goes through anyway. Since it's purchases successfully, recalling purcase so that one succeeds.
        }
        else if (err.message === getErrorMessage(102)) {
          if (repurchaseTries >= maxRepurchaseTries)
            reject(new Error(`Failed to purchase ${id} after ${maxRepurchaseTries} retries.`));
          else {
            repurchaseTries += 1;
            purchaseFn();
          }
        }
        else {
          reject(new Error(`${err}: for id ${id}`));
        }
      }
    }

    purchaseFn();

  });

  if (response.purchaseState === `PurchasedSuccessfully`)
      return response;
  else
    return Promise.reject(new Error(response.purchaseState));
}

export const isPurchased = () => 
  _isPurchased(5)
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
