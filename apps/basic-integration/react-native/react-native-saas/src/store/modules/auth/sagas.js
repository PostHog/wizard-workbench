import { takeLatest, all, call, put, select } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import toast from '../../../services/toast';
import api from '../../../services/api';
import NavigationService from '../../../services/navigation';
import { posthog } from '../../../config/posthog';
import { posthogLog } from '../../../services/posthogLog';
import { DEMO_TOKEN, isDemoMode, demoPermissions } from '../../../services/demoData';

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
      // The current auth response exposes no stable user id, so email is the fallback distinct id.
      // Keep email as a person property rather than an event property.
      if (posthog) {
        yield call([posthog, posthog.identify], email, {
          $set: { email },
        });
        yield call([posthog, posthog.capture], 'user_signed_in');
      }
      posthogLog.info('authentication completed', {
        operation: 'sign_in',
        mode: 'demo',
      });
      // Grant all permissions immediately in demo mode
      yield put(getPermissionsSuccess(demoPermissions.roles, demoPermissions.permissions));
      toast.showSuccess('Welcome to demo mode!');
      NavigationService.navigate('Main');
      return;
    }

    const response = yield call(api.post, 'sessions', { email, password });

    yield call([AsyncStorage, 'setItem'], '@Omni:token', response.data.token);

    yield put(signInSuccess(response.data.token));
    // The session endpoint currently returns only a token; use the authenticated
    // email until it provides the application's stable user id.
    if (posthog) {
      yield call([posthog, posthog.identify], email, {
        $set: { email },
      });
      yield call([posthog, posthog.capture], 'user_signed_in');
    }
    posthogLog.info('authentication completed', {
      operation: 'sign_in',
      mode: 'api',
    });
    NavigationService.navigate('Main');
  } catch (err) {
    posthogLog.warn('authentication rejected', {
      operation: 'sign_in',
    });
    toast.showError('Invalid credentials');
  }
}

export function* signOut() {
  if (posthog) {
    yield call([posthog, posthog.capture], 'user_signed_out');
    yield call([posthog, posthog.reset]);
  }
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
