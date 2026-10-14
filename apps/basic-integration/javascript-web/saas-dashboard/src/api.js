/**
 * Simulated async API layer.
 *
 * Wraps store operations in Promises with artificial delay
 * to mimic real network calls. In a real app, these would be
 * fetch() calls to a backend.
 */
import posthog, {
  identifyPostHogUser,
  isPostHogEnabled,
  posthogLogger,
  resetPostHog,
} from './posthog.js';
import { store } from './store.js';

const DELAY_MS = 150;

function delay(ms = DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function captureEvent(event, properties) {
  if (isPostHogEnabled) posthog.capture(event, properties);
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
    if (previousUser?.id !== user.id) {
      if (previousUser?.id) resetPostHog();
      identifyPostHogUser(user);
    }
    captureEvent('user_logged_in');
    posthogLogger.info('login completed');
    return user;
  },

  async logout() {
    await delay(50);
    captureEvent('user_logged_out');
    store.logout();
    resetPostHog();
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
    const attributes = { has_description: Boolean(project.description) };
    captureEvent('project_created', attributes);
    posthogLogger.info('project creation completed', attributes);
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
    const previousStatus = task?.status;
    store.updateTaskStatus(projectId, taskId, status);
    if (task) {
      const attributes = { previous_status: previousStatus, status };
      captureEvent('task_status_changed', attributes);
      posthogLogger.info('task status update completed', attributes);
    }
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
    store.assignTask(projectId, taskId, assigneeId);
    if (task) captureEvent('task_assigned', { is_assigned: Boolean(assigneeId) });
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
