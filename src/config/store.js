// lib
import { errorHandle } from 'src/lib';

// redux
import {
  applyMiddleware,
  createStore,
  compose
} from 'redux';
import reducer from 'src/reducers';

// middleware
import * as storage from 'redux-storage'
import createEngine from 'redux-storage-engine-reactnativeasyncstorage';
import filter from 'redux-storage-decorator-filter'
import reduxCatch from 'redux-catch';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

// redux logger
const logger = createLogger({
  predicate: (getState, action) => (
    action.type !== 'REDUX_STORAGE_SAVE' &&
    action.type !== 'TIME_CHANGE' &&
    action.type !== 'CELL_STATE_CHANGE'
  ),
  collapsed: (getState, action, logEntry) => !logEntry.error,
  diff: true,
  duration: true,
});

// local storage of store
const engine = createEngine('my-save-key');
// only store a subset of the whole state tree
engine = filter(engine,
  [
    ['general'],
    ['game'],
    // ['general', 'vibrate'],
    // ['settingsLocal'],
    // ['settingsRemote'],
  ]
);
const storageMiddleware = storage.createMiddleware(engine);

// for debugger
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// catch redux errors
function errorHandler(error, getState, lastAction, dispatch) {
   errorHandle(error);
}

let middleware = [thunk, storageMiddleware, reduxCatch(errorHandler)];

if (__DEV__)
  middleware.push(logger);

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(...middleware))
);

const load = storage.createLoader(engine);
load(store)
  .catch(err => {
    errorHandle(err);
    store.dispatch({type: 'ERROR_LOADING_STORE'})
  });

export default store;
