/**
 * Simulated async API layer.
 *
 * Wraps store operations in Promises with artificial delay
 * to mimic real network calls. In a real app, these would be
 * fetch() calls to a backend.
 */
import { captureEvent, identifyUser, posthogLogger, resetUser } from './posthog.js';
import { store } from './store.js';

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

    const currentUser = store.state.currentUser;
    if (previousUser && previousUser.id !== currentUser.id) resetUser();
    identifyUser(currentUser);
    captureEvent('user_signed_in', { login_method: 'email' });
    posthogLogger.info('user_signed_in', { login_method: 'email' });
    return currentUser;
  },

  async logout() {
    await delay(50);
    store.logout();
    captureEvent('user_signed_out');
    resetUser();
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
    captureEvent('project_created', { project_status: project.status });
    posthogLogger.info('project_created', { project_status: project.status });
    return project;
  },

  async deleteProject(id) {
    await delay();
    store.deleteProject(id);
    captureEvent('project_deleted');
  },

  async addTask(projectId, title, priority) {
    await delay();

    if (!title.trim()) throw new Error('Task title is required');
    const task = store.addTask(projectId, title.trim(), priority);
    if (task) captureEvent('task_created', { task_priority: task.priority });
    return task;
  },

  async updateTaskStatus(projectId, taskId, status) {
    await delay(50);
    store.updateTaskStatus(projectId, taskId, status);
    captureEvent('task_status_changed', { task_status: status });
    posthogLogger.info('task_status_changed', { task_status: status });
  },

  async deleteTask(projectId, taskId) {
    await delay(50);
    store.deleteTask(projectId, taskId);
    captureEvent('task_deleted');
  },

  async assignTask(projectId, taskId, assigneeId) {
    await delay(50);
    store.assignTask(projectId, taskId, assigneeId);
    captureEvent('task_assignment_changed', {
      assignment_state: assigneeId ? 'assigned' : 'unassigned',
    });
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
    captureEvent('settings_updated', { setting_names: Object.keys(updates).sort() });
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
