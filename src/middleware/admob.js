// lib
import { admob as _admob } from 'src/lib';

const adFrequency = 3;

const admob = store => next => action => {
  let result = next(action)
  // console.log()
  if (action.type === 'NEW_GAME' && store.getState().general.gameCounter % adFrequency == 0) 
	  _admob.showAd();
  return result
}

export default admob;
