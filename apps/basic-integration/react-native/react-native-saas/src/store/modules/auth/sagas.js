import { takeLatest, all, call, put, select } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import toast from '../../../services/toast';
import api from '../../../services/api';
import NavigationService from '../../../services/navigation';
import posthog, { captureException } from '../../../services/posthog';
import { DEMO_TOKEN, isDemoMode, demoPermissions } from '../../../services/demoData';

import {
  signInSuccess,
  getPermissionsSuccess,
  initCheckSuccess,
} from './actions';

import { selectTeam } from '../teams/actions';

export function* init() {
  const token = yield call([AsyncStorage, 'getItem'], '@Omni:token');
  const rememberedEmail = yield call([AsyncStorage, 'getItem'], '@Omni:email');

  if (token) {
    yield put(signInSuccess(token));

    if (rememberedEmail) {
      posthog.identify(rememberedEmail, {
        $set: {
          email: rememberedEmail,
          last_login_method: isDemoMode(token) ? 'demo' : 'email',
        },
      });
    }

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
    const { email, password, isDemoLogin } = payload;

    // Demo mode - login with demo@test.com / demo
    if (isDemoLogin) {
      yield call([AsyncStorage, 'setItem'], '@Omni:token', DEMO_TOKEN);
      yield call([AsyncStorage, 'setItem'], '@Omni:email', email);
      yield put(signInSuccess(DEMO_TOKEN));
      posthog.identify(email, {
        $set: {
          email,
          last_login_method: 'demo',
        },
        $set_once: {
          first_login_at: new Date().toISOString(),
        },
      });
      posthog.capture('sign_in_succeeded', {
        login_method: 'demo',
        is_demo_login: true,
      });
      // Grant all permissions immediately in demo mode
      yield put(getPermissionsSuccess(demoPermissions.roles, demoPermissions.permissions));
      toast.showSuccess('Welcome to demo mode!');
      NavigationService.navigate('Main');
      return;
    }

    const response = yield call(api.post, 'sessions', { email, password });

    yield call([AsyncStorage, 'setItem'], '@Omni:token', response.data.token);
    yield call([AsyncStorage, 'setItem'], '@Omni:email', email);

    posthog.identify(email, {
      $set: {
        email,
        last_login_method: 'email',
      },
      $set_once: {
        first_login_at: new Date().toISOString(),
      },
    });
    posthog.capture('sign_in_succeeded', {
      login_method: 'email',
      is_demo_login: false,
    });

    yield put(signInSuccess(response.data.token));
    NavigationService.navigate('Main');
  } catch (err) {
    posthog.capture('sign_in_failed', {
      login_method: payload?.isDemoLogin ? 'demo' : 'email',
      is_demo_login: Boolean(payload?.isDemoLogin),
      error_message: err?.message || 'Invalid credentials',
    });
    captureException(err, {
      area: 'auth',
      action: 'sign_in',
    });
    toast.showError('Invalid credentials');
  }
}

export function* signOut() {
  posthog.reset();
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
