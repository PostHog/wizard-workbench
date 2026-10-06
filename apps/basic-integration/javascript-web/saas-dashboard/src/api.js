/**
 * Simulated async API layer.
 *
 * Wraps store operations in Promises with artificial delay
 * to mimic real network calls. In a real app, these would be
 * fetch() calls to a backend.
 */
import posthog from 'posthog-js';
import { posthogLogger } from './posthog-logger.js';
import { store } from './store.js';

const posthogEnabled = Boolean(
  import.meta.env.VITE_POSTHOG_KEY && import.meta.env.VITE_POSTHOG_HOST,
);
const DELAY_MS = 150;

function delay(ms = DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const api = {
  async login(email) {
    await delay();

    const previousUser = store.state.currentUser;
    const success = store.login(email);
    if (!success) {
      throw new Error('Invalid credentials. Use a team member email.');
    }

    const user = store.state.currentUser;
    if (posthogEnabled) {
      if (previousUser?.id && previousUser.id !== user.id) {
        posthog.reset();
      }
      posthog.identify(user.id, {
        email: user.email,
        name: user.name,
        role: user.role,
      });
      posthog.capture('signed_in', { role: user.role });
    }

    return user;
  },

  async logout() {
    await delay(50);
    if (posthogEnabled) posthog.capture('signed_out');
    store.logout();
    if (posthogEnabled) posthog.reset();
  },

  async getProjects() {
    await delay();
    return store.state.projects;
  },

  async getProject(id) {
    await delay();
    const project = store.getProject(id);
    if (!project) throw new Error(`Project ${id} not found`);
    return project;
  },

  async createProject(name, description) {
    await delay();

    if (!name.trim()) throw new Error('Project name is required');
    const project = store.createProject(name.trim(), description.trim());
    if (posthogEnabled) {
      posthog.capture('project_created', {
        project_id: project.id,
        has_description: Boolean(project.description),
      });
      posthogLogger.info('project_created', {
        project_id: project.id,
        has_description: Boolean(project.description),
      });
    }
    return project;
  },

  async deleteProject(id) {
    await delay();
    store.deleteProject(id);
    if (posthogEnabled) posthog.capture('project_deleted', { project_id: id });
  },

  async addTask(projectId, title, priority) {
    await delay();

    if (!title.trim()) throw new Error('Task title is required');
    const task = store.addTask(projectId, title.trim(), priority);
    if (task && posthogEnabled) {
      posthog.capture('task_created', {
        project_id: projectId,
        task_id: task.id,
        priority: task.priority,
      });
      posthogLogger.info('task_created', {
        project_id: projectId,
        task_id: task.id,
        priority: task.priority,
      });
    }
    return task;
  },

  async updateTaskStatus(projectId, taskId, status) {
    await delay(50);
    store.updateTaskStatus(projectId, taskId, status);
    if (posthogEnabled) {
      posthog.capture('task_status_updated', {
        project_id: projectId,
        task_id: taskId,
        status,
      });
      posthogLogger.info('task_status_updated', {
        project_id: projectId,
        task_id: taskId,
        status,
      });
    }
  },

  async deleteTask(projectId, taskId) {
    await delay(50);
    store.deleteTask(projectId, taskId);
    if (posthogEnabled) posthog.capture('task_deleted', { project_id: projectId, task_id: taskId });
  },

  async assignTask(projectId, taskId, assigneeId) {
    await delay(50);
    store.assignTask(projectId, taskId, assigneeId);
    if (posthogEnabled) {
      posthog.capture('task_assignee_updated', {
        project_id: projectId,
        task_id: taskId,
        assignment_state: assigneeId ? 'assigned' : 'unassigned',
      });
    }
  },

  async getStats() {
    await delay();
    return store.getStats();
  },

  async getTeamMembers() {
    await delay();
    return store.state.teamMembers;
  },

  async updateSettings(updates) {
    await delay();
    store.updateSettings(updates);
    if (posthogEnabled) {
      posthog.capture('settings_updated', { setting_names: Object.keys(updates) });
    }
    return store.state.settings;
  },

  async getSettings() {
    await delay();
    return store.state.settings;
  },

  async getActivities() {
    await delay();
    return store.getActivities();
  },
};
