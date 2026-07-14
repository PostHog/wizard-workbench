import { takeLatest, call, put, all, select } from 'redux-saga/effects';
import toast from '../../../services/toast';
import api from '../../../services/api';
import posthog, { captureException } from '../../../services/posthog';
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
    posthog.capture('projects_loaded', {
      source: 'demo',
      project_count: projects.length,
      active_team_slug: team?.slug,
    });
    yield put(getProjectsSuccess(projects));
    return;
  }

  const response = yield call(api.get, 'projects');

  posthog.capture('projects_loaded', {
    source: 'api',
    project_count: response.data.length,
    active_team_slug: team?.slug,
  });

  yield put(getProjectsSuccess(response.data));
}

export function* createProject({ payload }) {
  const { title } = payload;
  const token = yield select(state => state.auth.token);

  try {
    // Demo mode
    if (isDemoMode(token)) {
      const newProject = { id: Date.now(), title };
      posthog.capture('project_created', {
        source: 'demo',
        project_title_length: title.length,
      });
      yield put(createProjectSuccess(newProject));
      yield put(closeProjectModal());
      toast.showSuccess('Project created');
      return;
    }

    const response = yield call(api.post, 'projects', { title });

    posthog.capture('project_created', {
      source: 'api',
      project_id: response.data.id,
      project_title_length: title.length,
    });

    yield put(createProjectSuccess(response.data));
    yield put(closeProjectModal());

    toast.showSuccess('Project created');
  } catch (err) {
    posthog.capture('project_create_failed', {
      project_title_length: title.length,
      error_message: err?.message || 'Error creating project',
    });
    captureException(err, {
      area: 'projects',
      action: 'create_project',
    });
    toast.showError('Error creating project');
  }
}

export default all([
  takeLatest('@projects/GET_PROJECTS_REQUEST', getProjects),
  takeLatest('@projects/CREATE_PROJECT_REQUEST', createProject),
]);
