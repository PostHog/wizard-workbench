import { takeLatest, call, put, all, select } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import toast from '../../../services/toast';
import api from '../../../services/api';
import { isDemoMode, demoTeams } from '../../../services/demoData';
import { posthog } from '../../../config/posthog';
import { logWorkspaceOperation } from '../../../config/posthogLogger';

import { getTeamsSuccess, createTeamSuccess, closeTeamModal } from './actions';
import { getProjectsRequest } from '../projects/actions';
import { getMembers } from '../members/sagas';
import { getPermissions } from '../auth/sagas';

function capturePostHog(event, properties) {
  if (!posthog) {
    return;
  }

  try {
    posthog.capture(event, properties);
  } catch (error) {
    if (__DEV__) {
      console.error(`PostHog could not capture ${event}`, error);
    }
  }
}

export function* getTeams() {
  const token = yield select(state => state.auth.token);

  // Demo mode
  if (isDemoMode(token)) {
    yield put(getTeamsSuccess(demoTeams));
    return;
  }

  const response = yield call(api.get, 'teams');

  yield put(getTeamsSuccess(response.data));
}

export function* createTeam({ payload }) {
  try {
    const { name } = payload;
    const token = yield select(state => state.auth.token);

    // Demo mode
    if (isDemoMode(token)) {
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      const newTeam = { id: Date.now(), name, slug };
      yield put(createTeamSuccess(newTeam));
      yield put(closeTeamModal());
      capturePostHog('team_created', { creation_mode: 'demo' });
      logWorkspaceOperation('workspace team creation completed', {
        operation: 'team_creation',
        creation_mode: 'demo',
      });
      toast.showSuccess('Team created');
      return;
    }

    const response = yield call(api.post, 'teams', { name });

    yield put(createTeamSuccess(response.data));
    yield put(closeTeamModal());
    capturePostHog('team_created', { creation_mode: 'api' });
    logWorkspaceOperation('workspace team creation completed', {
      operation: 'team_creation',
      creation_mode: 'api',
    });

    toast.showSuccess('Team created');
  } catch (err) {
    toast.showError('Error creating team');
  }
}

export function* selectActiveTeam({ payload }) {
  const { team } = payload;

  yield call([AsyncStorage, 'setItem'], '@Omni:team', JSON.stringify(team));
  capturePostHog('team_selected');

  yield put(getProjectsRequest());
}

export default all([
  takeLatest('@teams/GET_TEAMS_REQUEST', getTeams),
  takeLatest('@teams/CREATE_TEAM_REQUEST', createTeam),
  takeLatest('@teams/SELECT_TEAM', selectActiveTeam),
  takeLatest('@teams/SELECT_TEAM', getMembers),
  takeLatest('@teams/SELECT_TEAM', getPermissions),
]);
