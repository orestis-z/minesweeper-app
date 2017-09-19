import { combineReducers } from 'redux';

import general from './generalReducer';

const rootReducer = combineReducers({
  // settingsLocal,
  // settingsRemote,
  general,
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

