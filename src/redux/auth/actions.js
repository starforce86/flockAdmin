const actions = {
  CHECK_AUTHORIZATION: 'CHECK_AUTHORIZATION',
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGOUT: 'LOGOUT',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
  TOGGLE_CHANGE_PASSWORD_MODAL: 'TOGGLE_CHANGE_PASSWORD_MODAL',
  checkAuthorization: () => ({ type: actions.CHECK_AUTHORIZATION }),
  login: payload => ({
    type: actions.LOGIN_REQUEST,
    payload
  }),
  logout: () => ({
    type: actions.LOGOUT
  }),
  changePassword: payload => ({
    type: actions.CHANGE_PASSWORD,
    payload
  }),
  toggleChangePasswordModal: () => (dispatch) => {
    return dispatch({
      type: actions.TOGGLE_CHANGE_PASSWORD_MODAL
    })
  }
};
export default actions;
