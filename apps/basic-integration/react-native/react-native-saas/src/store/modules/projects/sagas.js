import { takeLatest, call, put, all, select } from 'redux-saga/effects';
import toast from '../../../services/toast';
import api from '../../../services/api';
import { posthog } from '../../../config/posthog';
import { isDemoMode, demoProjects } from '../../../services/demoData';

import {
  getProjectsSuccess,
  createProjectSuccess,
  closeProjectModal,
} from './actions';

export function* getProjects() {
  const token = yield select(state => state.auth.token);
  const team = yield select(state => state.teams.active);

  // Demo mode
  if (isDemoMode(token)) {
    const projects = team ? (demoProjects[team.slug] || []) : [];
    yield put(getProjectsSuccess(projects));
    return;
  }

  const response = yield call(api.get, 'projects');

  yield put(getProjectsSuccess(response.data));
}

export function* createProject({ payload }) {
  const { title } = payload;
  const token = yield select(state => state.auth.token);

  try {
    // Demo mode
    if (isDemoMode(token)) {
      const newProject = { id: Date.now(), title };
      yield put(createProjectSuccess(newProject));
      if (posthog) {
        posthog.capture('project_created', { creation_method: 'demo' });
      }
      yield put(closeProjectModal());
      toast.showSuccess('Project created');
      return;
    }

    const response = yield call(api.post, 'projects', { title });

    yield put(createProjectSuccess(response.data));
    if (posthog) {
      posthog.capture('project_created', { creation_method: 'api' });
    }
    yield put(closeProjectModal());

    toast.showSuccess('Project created');
  } catch (err) {
    toast.showError('Error creating project');
  }
}

export default all([
  takeLatest('@projects/GET_PROJECTS_REQUEST', getProjects),
  takeLatest('@projects/CREATE_PROJECT_REQUEST', createProject),
]);
