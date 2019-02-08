import { all, takeEvery, put, call, fork, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import actions from './actions';
import { setToken, clearToken, getToken, setUsername, clearUsername, getUsername } from '../../helpers/utility';
import AuthHelper from '../../helpers/authHelper';
import notification from '../../components/notification';

export function* loginRequest() {
  yield takeEvery('LOGIN_REQUEST', function*({ payload }) {
    const { history, userInfo } = payload;
    const result = yield call(AuthHelper.login, userInfo);
    if (result.token) {
      yield put({
        type: actions.LOGIN_SUCCESS,
        payload: result,
        token: result.token,
        username: result.username,
        history
      });
    } else {
      notification('error', result.error || result);
      yield put({ type: actions.LOGIN_ERROR });
    }
  });
}

export function* loginSuccess() {
  yield takeEvery(actions.LOGIN_SUCCESS, function*({ payload, history }) {
    yield setToken(payload.token);
    yield setUsername(payload.username);
    if (history) {
      history.push('/dashboard');
    }
  });
}

export function* loginError() {
  yield takeEvery(actions.LOGIN_ERROR, function*() {});
}

export function* logout() {
  yield takeEvery(actions.LOGOUT, function*() {
    clearToken();
    clearUsername();
    yield put(push('/'));
  });
}

export function* changePassword() {
  yield takeEvery(actions.CHANGE_PASSWORD, function*({ payload }) {
    const state = yield select();
    const result = yield call(AuthHelper.changePassword, {
      token: state.Auth.idToken,
      username: state.Auth.username, 
      oldPassword: payload.oldPassword, 
      newPassword: payload.newPassword, 
      confirmNewPassword: payload.confirmNewPassword
    });
    if (result.success === 1) {
      notification('success', 'Successfully updated password.');
      yield put({
        type: actions.TOGGLE_CHANGE_PASSWORD_MODAL
      })
    } else {
      notification('error', result.errMsg || result);
    }
  });
}

export function* checkAuthorization() {
  yield takeEvery(actions.CHECK_AUTHORIZATION, function*() {
    const { token } = AuthHelper.checkExpirity(getToken());
    const username = getUsername();
    if (token) {
      yield put({
        type: actions.LOGIN_SUCCESS,
        payload: { token, username },
        token,
        username,
        profile: 'Profile'
      });
    }
  });
}
export default function* rootSaga() {
  yield all([
    fork(checkAuthorization),
    fork(loginRequest),
    fork(loginSuccess),
    fork(loginError),
    fork(logout),
    fork(changePassword)
  ]);
}
