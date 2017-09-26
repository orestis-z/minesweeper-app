import { combineReducers } from 'redux';

import general from './generalReducer';
import game from './gameReducer';

const rootReducer = combineReducers({
  // settingsLocal,
  // settingsRemote,
  general,
  game,
  // loadStore,
  // auth,
  // events,
  // users,
});

export default (state, action) => {
  if (action.type === 'RESET') {
    state = undefined;
  }
  return rootReducer(state, action);
}

