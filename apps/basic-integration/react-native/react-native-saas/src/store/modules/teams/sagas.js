import { takeLatest, call, put, all, select } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import toast from '../../../services/toast';
import api from '../../../services/api';
import { posthog } from '../../../services/posthog';
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
  try {
    const { name } = payload;
    const token = yield select(state => state.auth.token);

    // Demo mode
    if (isDemoMode(token)) {
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      const newTeam = { id: Date.now(), name, slug };
      yield put(createTeamSuccess(newTeam));
      yield put(closeTeamModal());
      yield call([posthog, 'capture'], 'team_created', { source: 'demo' });
      toast.showSuccess('Team created');
      return;
    }

    const response = yield call(api.post, 'teams', { name });

    yield put(createTeamSuccess(response.data));
    yield put(closeTeamModal());
    yield call([posthog, 'capture'], 'team_created', { source: 'api' });

    toast.showSuccess('Team created');
  } catch (err) {
    yield call([posthog, 'captureException'], err, {
      flow: 'create_team',
    });
    toast.showError('Error creating team');
  }
}

export function* selectActiveTeam({ payload }) {
  const { team } = payload;

  yield call([AsyncStorage, 'setItem'], '@Omni:team', JSON.stringify(team));
  yield call([posthog, 'capture'], 'team_selected', {
    team_id: String(team.id),
  });

  yield put(getProjectsRequest());
}

export default all([
  takeLatest('@teams/GET_TEAMS_REQUEST', getTeams),
  takeLatest('@teams/CREATE_TEAM_REQUEST', createTeam),
  takeLatest('@teams/SELECT_TEAM', selectActiveTeam),
  takeLatest('@teams/SELECT_TEAM', getMembers),
  takeLatest('@teams/SELECT_TEAM', getPermissions),
]);
