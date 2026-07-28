import { takeLatest, all, call, put, select } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import toast from '../../../services/toast';
import api from '../../../services/api';
import NavigationService from '../../../services/navigation';
import { DEMO_TOKEN, isDemoMode, demoPermissions } from '../../../services/demoData';
import { posthog } from '../../../config/posthog';

const ANALYTICS_USER_STORAGE_KEY = '@Omni:analyticsUser';
const DEMO_USER_ID = 'demo-user';

function* identifyUser(distinctId, email) {
  if (!posthog || !distinctId) {
    return;
  }

  yield call([posthog, 'identify'], distinctId, {
    $set: { email },
  });
}

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
      yield call(identifyUser, DEMO_USER_ID, 'demo@test.com');
    } else {
      const analyticsUser = yield call(
        [AsyncStorage, 'getItem'],
        ANALYTICS_USER_STORAGE_KEY,
      );

      if (analyticsUser) {
        const { distinctId, email } = JSON.parse(analyticsUser);
        yield call(identifyUser, distinctId, email);
      }
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
      yield call(identifyUser, DEMO_USER_ID, email);
      // Grant all permissions immediately in demo mode
      yield put(getPermissionsSuccess(demoPermissions.roles, demoPermissions.permissions));
      if (posthog) {
        yield call([posthog, 'capture'], 'user_logged_in', {
          login_method: 'demo',
        });
      }
      toast.showSuccess('Welcome to demo mode!');
      NavigationService.navigate('Main');
      return;
    }

    const response = yield call(api.post, 'sessions', { email, password });

    yield call([AsyncStorage, 'setItem'], '@Omni:token', response.data.token);

    // The session response exposes no stable user primary key, so email is the
    // documented fallback distinct ID until the API returns one.
    yield call(
      [AsyncStorage, 'setItem'],
      ANALYTICS_USER_STORAGE_KEY,
      JSON.stringify({ distinctId: email, email }),
    );
    yield call(identifyUser, email, email);
    if (posthog) {
      yield call([posthog, 'capture'], 'user_logged_in', {
        login_method: 'password',
      });
    }

    yield put(signInSuccess(response.data.token));
    NavigationService.navigate('Main');
  } catch (err) {
    toast.showError('Invalid credentials');
  }
}

export function* signOut() {
  if (posthog) {
    yield call([posthog, 'capture'], 'user_logged_out');
    yield call([posthog, 'reset']);
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
