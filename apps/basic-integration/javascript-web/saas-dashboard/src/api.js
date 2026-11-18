/**
 * Simulated async API layer.
 *
 * Wraps store operations in Promises with artificial delay
 * to mimic real network calls. In a real app, these would be
 * fetch() calls to a backend.
 */
import { captureEvent, identifyUser, posthogLogger, resetPosthog } from './posthog.js';
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
    if (previousUser?.id && previousUser.id !== currentUser.id) {
      resetPosthog();
    }
    identifyUser(currentUser);
    const account_switched = Boolean(previousUser?.id && previousUser.id !== currentUser.id);
    captureEvent('user_signed_in', {
      role: currentUser.role,
      account_switched,
    });
    posthogLogger.info('user session started', {
      role: currentUser.role,
      account_switched,
    });
    return currentUser;
  },

  async logout() {
    await delay(50);
    captureEvent('user_signed_out');
    resetPosthog();
    store.logout();
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
    captureEvent('project_created', { initial_task_count: project.tasks.length });
    posthogLogger.info('project created', { initial_task_count: project.tasks.length });
    return project;
  },

  async deleteProject(id) {
    await delay();
    const project = store.getProject(id);
    store.deleteProject(id);
    if (project) captureEvent('project_deleted', { task_count: project.tasks.length });
  },

  async addTask(projectId, title, priority) {
    await delay();

    if (!title.trim()) throw new Error('Task title is required');
    const task = store.addTask(projectId, title.trim(), priority);
    if (task) captureEvent('task_created', { priority: task.priority });
    return task;
  },

  async updateTaskStatus(projectId, taskId, status) {
    await delay(50);
    const task = store.getProject(projectId)?.tasks.find((item) => item.id === taskId);
    if (!task || task.status === status) return;

    const previous_status = task.status;
    store.updateTaskStatus(projectId, taskId, status);
    captureEvent('task_status_changed', { previous_status, status });
    posthogLogger.info('task status changed', { previous_status, status });
  },

  async deleteTask(projectId, taskId) {
    await delay(50);
    const task = store.getProject(projectId)?.tasks.find((item) => item.id === taskId);
    store.deleteTask(projectId, taskId);
    if (task) captureEvent('task_deleted', { priority: task.priority, status: task.status });
  },

  async assignTask(projectId, taskId, assigneeId) {
    await delay(50);
    const task = store.getProject(projectId)?.tasks.find((item) => item.id === taskId);
    if (!task || task.assignee === assigneeId) return;

    store.assignTask(projectId, taskId, assigneeId);
    captureEvent('task_assignee_changed', {
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
    captureEvent('settings_updated', { setting_names: Object.keys(updates) });
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
