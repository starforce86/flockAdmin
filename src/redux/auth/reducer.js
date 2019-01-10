import actions from './actions';

const initState = { idToken: null };

export default function authReducer(state = initState, action) {
  switch (action.type) {
    case actions.LOGIN_SUCCESS:
      return { 
        ...state, 
        idToken: action.token,
        last_accessed: action.payload.last_accessed
      };
    case actions.LOGOUT:
      return initState;
    default:
      return state;
  }
}
