export default function reducer(state=
  {
    orientation: 'PORTRAIT',
    windowSize: {width: 0, height: 0},
    level: 1,
    fieldSize: 2,
    vibrate: true,
    gameCounter: 1,
    purchased: false,
    loaded: false,
  },
  action) {
  switch (action.type) {
    case 'REDUX_STORAGE_LOAD':
      if (action.payload.general)
        return {
          ...state,
          level: action.payload.general.level,
          fieldSize: action.payload.general.fieldSize,
          vibrate: action.payload.general.vibrate,
          gameCounter: action.payload.general.gameCounter,
          purchased: action.payload.general.purchased,
          loaded: true,
        };
      else
        return {
          ...state,
          loaded: true
        };
    case 'ERROR_LOADING_STORE':
      return {
        ...state,
        loaded: true
      };
    case 'VIBRATE':
      return {
        ...state,
        vibrate: action.payload,
      };
    case 'FIELD_SIZE':
      return {
        ...state,
        fieldSize: action.payload,
      };
    case 'LEVEL':
      return {
        ...state,
        level: action.payload,
      };
    case 'NEW_GAME':
      return {
        ...state,
        gameCounter: state.gameCounter + 1,
      };
    case 'ORIENTATION_CHANGE':
      return {
        ...state,
        windowSize: {
          width: action.payload.width,
          height:action.payload.height,
        },
        orientation: action.payload.orientation,
      };
    default:
      return state;
  };
};
