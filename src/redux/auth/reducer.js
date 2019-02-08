import actions from './actions';

const initState = { 
  idToken: null,
  username: null,
  changePasswordModalActive: false
};

export default function authReducer(state = initState, action) {
  switch (action.type) {
    case actions.LOGIN_SUCCESS:
      return {
        ...state,
        idToken: action.token,
        username: action.username,
        last_accessed: action.payload.last_accessed
      };
    case actions.LOGOUT:
      return initState;
    case actions.TOGGLE_CHANGE_PASSWORD_MODAL:
      return {
        ...state,
        changePasswordModalActive: !state.changePasswordModalActive
      };
    default:
      return state;
  }
}
