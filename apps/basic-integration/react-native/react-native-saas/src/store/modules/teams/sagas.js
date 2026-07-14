import { takeLatest, call, put, all, select } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import toast from '../../../services/toast';
import api from '../../../services/api';
import posthog, { captureException } from '../../../services/posthog';
import { isDemoMode, demoTeams } from '../../../services/demoData';

import { getTeamsSuccess, createTeamSuccess, closeTeamModal } from './actions';
import { getProjectsRequest } from '../projects/actions';
import { getMembers } from '../members/sagas';
import { getPermissions } from '../auth/sagas';

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
  const { name } = payload;

  try {
    const token = yield select(state => state.auth.token);

    // Demo mode
    if (isDemoMode(token)) {
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      const newTeam = { id: Date.now(), name, slug };
      posthog.capture('team_created', {
        source: 'demo',
        team_slug: slug,
        team_name_length: name.length,
      });
      yield put(createTeamSuccess(newTeam));
      yield put(closeTeamModal());
      toast.showSuccess('Team created');
      return;
    }

    const response = yield call(api.post, 'teams', { name });

    posthog.capture('team_created', {
      source: 'api',
      team_id: response.data.id,
      team_slug: response.data.slug,
      team_name_length: name.length,
    });

    yield put(createTeamSuccess(response.data));
    yield put(closeTeamModal());

    toast.showSuccess('Team created');
  } catch (err) {
    posthog.capture('team_create_failed', {
      team_name_length: name.length,
      error_message: err?.message || 'Error creating team',
    });
    captureException(err, {
      area: 'teams',
      action: 'create_team',
    });
    toast.showError('Error creating team');
  }
}

export function* selectActiveTeam({ payload }) {
  const { team } = payload;

  posthog.register({
    active_team_slug: team.slug,
    active_team_name: team.name,
  });
  posthog.capture('team_selected', {
    team_id: team.id,
    team_slug: team.slug,
    team_name_length: team.name?.length,
  });

  yield call([AsyncStorage, 'setItem'], '@Omni:team', JSON.stringify(team));

  yield put(getProjectsRequest());
}

export default all([
  takeLatest('@teams/GET_TEAMS_REQUEST', getTeams),
  takeLatest('@teams/CREATE_TEAM_REQUEST', createTeam),
  takeLatest('@teams/SELECT_TEAM', selectActiveTeam),
  takeLatest('@teams/SELECT_TEAM', getMembers),
  takeLatest('@teams/SELECT_TEAM', getPermissions),
]);
