import { call, put } from 'redux-saga/effects';
import { CustomException } from '../../utils/customException';
import { loginError, loginSuccess } from './authSlice';
import { authApi } from '../../services/auth';

export function* authSaga({ payload }) {
  try {
    const locais = yield call(authApi, payload);
    yield put(loginSuccess(locais));
  } catch (error) {
    yield put(loginError(new CustomException(error).data()));
  }
}
