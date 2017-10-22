// lib
import { admob as _admob } from 'src/lib';

// config
import { params } from 'src/config';

const adFrequency = 3;

const admob = store => next => action => {
  const  result = next(action)
  const { general } = store.getState();
  // if (action.type !== 'REDUX_STORAGE_SAVE' && action.type !== 'TIME_CHANGE') {
//	  console.log('----' + action.type + '----')
//	  console.log(general)
  // }
  if (
  	action.type === 'NEW_GAME' &&
  	!general.purchased &&
  	general.gameCounter > params.adFactor * params.purchaseInterval &&
  	general.gameCounter % params.adFrequency == 0) 
	  _admob.showAd();
  return result
}

export default admob;
