import { takeLatest, all, call, put, select } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import toast from '../../../services/toast';
import api from '../../../services/api';
import NavigationService from '../../../services/navigation';
import { posthog, posthogLog } from '../../../config/posthog';
import { DEMO_TOKEN, isDemoMode, demoPermissions } from '../../../services/demoData';

import {
  signInSuccess,
  getPermissionsSuccess,
  initCheckSuccess,
} from './actions';

import { selectTeam } from '../teams/actions';

function getUserDistinctId(email) {
  const normalizedEmail = email.trim().toLowerCase();
  let firstHash = 2166136261;
  let secondHash = 2246822507;

  for (let index = 0; index < normalizedEmail.length; index += 1) {
    const character = normalizedEmail.charCodeAt(index);
    firstHash = Math.imul(firstHash, 16777619) + character;
    secondHash = Math.imul(secondHash, 3266489909) + character;
  }

  const firstPart = Math.abs(firstHash).toString(16);
  const secondPart = Math.abs(secondHash).toString(16);

  return `user_${firstPart}${secondPart}`;
}

export function* init() {
  const token = yield call([AsyncStorage, 'getItem'], '@Omni:token');

  if (token) {
    yield put(signInSuccess(token));
    // Grant permissions immediately in demo mode
    if (isDemoMode(token)) {
      yield put(getPermissionsSuccess(demoPermissions.roles, demoPermissions.permissions));
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
      posthog?.identify(getUserDistinctId(email), {
        $set: { email },
      });
      posthog?.capture('user_signed_in', { authentication_method: 'demo' });
      posthogLog.info('User signed in', { authentication_method: 'demo' });
      // Grant all permissions immediately in demo mode
      yield put(getPermissionsSuccess(demoPermissions.roles, demoPermissions.permissions));
      toast.showSuccess('Welcome to demo mode!');
      NavigationService.navigate('Main');
      return;
    }

    const response = yield call(api.post, 'sessions', { email, password });

    yield call([AsyncStorage, 'setItem'], '@Omni:token', response.data.token);

    yield put(signInSuccess(response.data.token));
    posthog?.identify(getUserDistinctId(email), {
      $set: { email },
    });
    posthog?.capture('user_signed_in', { authentication_method: 'password' });
    posthogLog.info('User signed in', { authentication_method: 'password' });
    NavigationService.navigate('Main');
  } catch (err) {
    toast.showError('Invalid credentials');
  }
}

export function* signOut() {
  posthog?.capture('user_signed_out');
  posthog?.reset();
  yield call([AsyncStorage, 'clear']);
  NavigationService.reset('SignIn');
}

export function* getPermissions() {
  const team = yield select(state => state.teams.active);
  const signedIn = yield select(state => state.auth.signedIn);
  const token = yield select(state => state.auth.token);

  if (!signedIn || !team) {
    return;
  }

  // Demo mode - grant full admin permissions
  if (isDemoMode(token)) {
    yield put(getPermissionsSuccess(demoPermissions.roles, demoPermissions.permissions));
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
