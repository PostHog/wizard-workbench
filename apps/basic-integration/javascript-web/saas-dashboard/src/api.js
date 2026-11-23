/**
 * Simulated async API layer.
 *
 * Wraps store operations in Promises with artificial delay
 * to mimic real network calls. In a real app, these would be
 * fetch() calls to a backend.
 */
import { store } from './store.js';
import posthog, { isPostHogEnabled } from './posthog.js';

const DELAY_MS = 150;

function identifyUser(user) {
  if (!isPostHogEnabled || !user?.id) return;

  posthog.identify(user.id, {
    email: user.email,
    name: user.name,
    role: user.role,
  });
}

function delay(ms = DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function capture(event, properties) {
  if (isPostHogEnabled) posthog.capture(event, properties);
}

const posthogLogger = {
  info(message, attributes) {
    if (isPostHogEnabled) posthog.logger.info(message, attributes);
  },
};

export const api = {
  async login(email) {
    await delay();

    const previousUserId = store.state.currentUser?.id;
    const success = store.login(email);
    if (!success) {
      throw new Error('Invalid credentials. Use a team member email.');
    }

    const user = store.state.currentUser;
    if (isPostHogEnabled && previousUserId && previousUserId !== user.id) {
      posthog.reset();
    }
    identifyUser(user);
    capture('user_logged_in', { role: user.role });
    posthogLogger.info('user login completed', { role: user.role });
    return user;
  },

  identifyCurrentUser() {
    identifyUser(store.state.currentUser);
  },

  async logout() {
    await delay(50);
    capture('user_logged_out');
    if (isPostHogEnabled) posthog.reset();
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
    const hasDescription = Boolean(description.trim());
    capture('project_created', { has_description: hasDescription });
    posthogLogger.info('project creation completed', { has_description: hasDescription });
    return project;
  },

  async deleteProject(id) {
    await delay();
    const project = store.getProject(id);
    store.deleteProject(id);
    capture('project_deleted', { task_count: project?.tasks.length ?? 0 });
  },

  async addTask(projectId, title, priority) {
    await delay();

    if (!title.trim()) throw new Error('Task title is required');
    const task = store.addTask(projectId, title.trim(), priority);
    capture('task_created', { priority });
    return task;
  },

  async updateTaskStatus(projectId, taskId, status) {
    await delay(50);
    store.updateTaskStatus(projectId, taskId, status);
    capture('task_status_updated', { destination_status: status });
    posthogLogger.info('task status update completed', { destination_status: status });
  },

  async deleteTask(projectId, taskId) {
    await delay(50);
    store.deleteTask(projectId, taskId);
    capture('task_deleted');
  },

  async assignTask(projectId, taskId, assigneeId) {
    await delay(50);
    store.assignTask(projectId, taskId, assigneeId);
    capture('task_assignee_updated', { assignment_state: assigneeId ? 'assigned' : 'unassigned' });
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
    capture('settings_updated', { changed_settings: Object.keys(updates) });
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
