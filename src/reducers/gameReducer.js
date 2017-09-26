import { Dimensions } from 'react-native';

export default function reducer(state=
  {
    cellStates: {},
    gameState: 'NOT_STARTED',
    time: 0,
    inputMode: 0,
    mineCount: 0,
    mineField: undefined,
    dims: {
      buttonSize: 0,
      dimensions: [0, 0],
      delta: 0,
    },
  },
  action) {
  switch (action.type) {
    case 'REDUX_STORAGE_LOAD':
      if (
        action.payload.game &&
        action.payload.general.windowSize.width === Dimensions.get('window').width &&
        action.payload.general.windowSize.height === Dimensions.get('window').height)
        return {
          ...state,
          cellStates: action.payload.game.cellStates,
          gameState: action.payload.game.gameState,
          // dimensions: action.payload.game.dimensions,
          time: action.payload.game.time,
          inputMode: action.payload.game.inputMode,
          mineField: action.payload.game.mineField,
        };
      else
        return state;
    case 'SET_STATE':
      return {
        ...state,
        ...action.payload,
      }
    case 'CELL_STATE_CHANGE':
      return {
        ...state,
        cellStates: {
          ...state.cellStates,
          [action.i + ',' + action.j]: action.payload,
        },
      };
    case 'SET_CELL_STATES':
      return {
        ...state,
        cellStates: action.payload,
      };
    case 'GAME_STATE_CHANGE':
      return {
        ...state,
        gameState: action.payload,
      };
    case 'TIME_CHANGE':
      return {
        ...state,
        time: action.payload,
      };
    case 'INPUT_MODE_CHANGE':
      return {
        ...state,
        inputMode: action.payload,
      };
    case 'MINE_COUNT_CHANGE':
      return {
        ...state,
        mineCount: action.payload,
      };
    case 'MINE_FIELD_CONFIG':
      return {
        ...state,
        mineField: action.payload,
      };
    // case 'ORIENTATION_CHANGE':
    case 'NEW_GAME':
    case 'FIELD_SIZE':
    case 'LEVEL':
      return {
        ...state,
        cellStates: {},
        gameState: 'NOT_STARTED',
        mineField: undefined,
      }
    default:
      return state;
  };
};
