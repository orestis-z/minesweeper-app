export default function reducer(state=
  {
    windowSize: {width: 0, height: 0},
    level: 0,
    fieldSize: 2,
    vibrate: true,
    loaded: false,
  },
  action) {
  switch (action.type) {
    case 'REDUX_STORAGE_LOAD':
      if (action.payload.general)
        return {
          ...state,
          fieldSize: action.payload.general.fieldSize,
          vibrate: action.payload.general.vibrate,
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
