import { takeLatest, all, call, put, select } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import toast from '../../../services/toast';
import api from '../../../services/api';
import NavigationService from '../../../services/navigation';
import {
  DEMO_TOKEN,
  isDemoMode,
  demoPermissions,
} from '../../../services/demoData';
import { posthog } from '../../../config/posthog';

import {
  signInSuccess,
  getPermissionsSuccess,
  initCheckSuccess,
} from './actions';

import { selectTeam } from '../teams/actions';

export function* init() {
  const token = yield call([AsyncStorage, 'getItem'], '@Omni:token');

  if (token) {
    yield put(signInSuccess(token));
    // Grant permissions immediately in demo mode
    if (isDemoMode(token)) {
      yield put(
        getPermissionsSuccess(
          demoPermissions.roles,
          demoPermissions.permissions
        )
      );
    }
  }

  const team = yield call([AsyncStorage, 'getItem'], '@Omni:team');

  if (team) {
    yield put(selectTeam(JSON.parse(team)));
  }

  yield put(initCheckSuccess());
}

export function* signIn({ payload }) {
  try {
    const { email, password } = payload;

    // Demo mode - login with demo@test.com / demo
    if (email === 'demo@test.com' && password === 'demo') {
      yield call([AsyncStorage, 'setItem'], '@Omni:token', DEMO_TOKEN);
      yield put(signInSuccess(DEMO_TOKEN));
      // Grant all permissions immediately in demo mode
      yield put(
        getPermissionsSuccess(
          demoPermissions.roles,
          demoPermissions.permissions
        )
      );
      posthog.identify(email, { $set: { email } });
      posthog.capture('user_signed_in', { email, is_demo: true });
      toast.showSuccess('Welcome to demo mode!');
      NavigationService.navigate('Main');
      return;
    }

    const response = yield call(api.post, 'sessions', { email, password });

    yield call([AsyncStorage, 'setItem'], '@Omni:token', response.data.token);

    yield put(signInSuccess(response.data.token));
    posthog.identify(email, { $set: { email } });
    posthog.capture('user_signed_in', { email, is_demo: false });
    NavigationService.navigate('Main');
  } catch (err) {
    toast.showError('Invalid credentials');
    posthog.capture('sign_in_failed', { email: payload?.email });
  }
}

export function* signOut() {
  posthog.capture('user_signed_out');
  posthog.reset();
  yield call([AsyncStorage, 'clear']);
  NavigationService.reset('SignIn');
}

export function* getPermissions() {
  const team = yield select((state) => state.teams.active);
  const signedIn = yield select((state) => state.auth.signedIn);
  const token = yield select((state) => state.auth.token);

  if (!signedIn || !team) {
    return;
  }

  // Demo mode - grant full admin permissions
  if (isDemoMode(token)) {
    yield put(
      getPermissionsSuccess(demoPermissions.roles, demoPermissions.permissions)
    );
    return;
  }

  const response = yield call(api.get, 'permissions');

  const { roles, permissions } = response.data;

  yield put(getPermissionsSuccess(roles, permissions));
}

export default all([
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_OUT', signOut),
  takeLatest('@auth/INIT_CHECK_SUCCESS', getPermissions),
]);
