import { all, takeLatest } from 'redux-saga/effects';
import { authSaga } from './auth/authSaga';

// import { userSaga } from './user/userSaga';

export default function* rootSaga() {
  return yield all([takeLatest('userData/loginStart', authSaga)]);
}
