import { takeLatest, all, call, put, select } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import toast from '../../../services/toast';
import api from '../../../services/api';
import NavigationService from '../../../services/navigation';
import { DEMO_TOKEN, isDemoMode, demoPermissions } from '../../../services/demoData';
import {
  identifySignedInUser,
  resetPostHogUser,
  trackEvent,
  trackException,
} from '../../../services/posthogTracking';
import { sanitizeEmailDomain } from '../../../services/posthog';

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
      yield call(identifySignedInUser, { email, isDemoMode: true });
      yield call(trackEvent, 'sign_in_succeeded', {
        auth_method: 'demo_credentials',
        email_domain: sanitizeEmailDomain(email),
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
    yield call(identifySignedInUser, { email, isDemoMode: false });
    yield call(trackEvent, 'sign_in_succeeded', {
      auth_method: 'password',
      email_domain: sanitizeEmailDomain(email),
    });
    NavigationService.navigate('Main');
  } catch (err) {
    yield call(trackEvent, 'sign_in_failed', {
      auth_method: 'password',
      email_domain: sanitizeEmailDomain(payload.email),
    });
    yield call(trackException, err, {
      source: 'auth_sign_in',
      email_domain: sanitizeEmailDomain(payload.email),
    });
    toast.showError('Invalid credentials');
  }
}

export function* signOut() {
  const activeTeam = yield select(state => state.teams.active);

  yield call(trackEvent, 'signed_out', {
    had_active_team: Boolean(activeTeam),
    team_slug: activeTeam?.slug,
  });
  yield call(resetPostHogUser);
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
