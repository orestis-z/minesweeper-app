// lib
import { errorHandle } from "src/lib";

// redux
import { applyMiddleware, createStore, compose } from "redux";
import reducer from "src/reducers";

// middleware
import reduxCatch from "redux-catch";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";

// redux logger
const logger = createLogger({
  predicate: (getState, action) =>
    action.type !== "REDUX_STORAGE_SAVE" &&
    action.type !== "TIME_CHANGE" &&
    action.type !== "CELL_STATE_CHANGE",
  collapsed: (getState, action, logEntry) => !logEntry.error,
  diff: true,
  duration: true,
});

// for debugger
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// catch redux errors
function errorHandler(error) {
  errorHandle(error);
}

let middleware = [thunk, reduxCatch(errorHandler)];

if (__DEV__) middleware.push(logger);

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(...middleware)),
);

export default store;
