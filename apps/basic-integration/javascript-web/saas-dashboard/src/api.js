/**
 * Simulated async API layer.
 *
 * Wraps store operations in Promises with artificial delay
 * to mimic real network calls. In a real app, these would be
 * fetch() calls to a backend.
 */
import posthog from 'posthog-js';
import { store } from './store.js';

const DELAY_MS = 150;
const posthogEnabled = Boolean(
  import.meta.env.VITE_POSTHOG_KEY && import.meta.env.VITE_POSTHOG_HOST,
);

function identifyUser(user) {
  if (!posthogEnabled || !user?.id) return;

  posthog.identify(user.id, {
    email: user.email,
    name: user.name,
    role: user.role,
  });
}

function capture(event, properties) {
  if (posthogEnabled) posthog.capture(event, properties);
}

function delay(ms = DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const api = {
  async login(email) {
    await delay();

    const previousUserId = store.state.currentUser?.id;
    const success = store.login(email);
    if (!success) {
      throw new Error('Invalid credentials. Use a team member email.');
    }

    const user = store.state.currentUser;
    if (posthogEnabled && previousUserId && previousUserId !== user.id) posthog.reset();
    identifyUser(user);
    capture('user_logged_in', { role: user.role });
    return user;
  },

  async logout() {
    await delay(50);
    capture('user_logged_out');
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
    capture('project_created', { project_id: project.id });
    return project;
  },

  async deleteProject(id) {
    await delay();
    store.deleteProject(id);
    capture('project_deleted', { project_id: id });
  },

  async addTask(projectId, title, priority) {
    await delay();

    if (!title.trim()) throw new Error('Task title is required');
    const task = store.addTask(projectId, title.trim(), priority);
    if (task) capture('task_created', { project_id: projectId, task_id: task.id, priority });
    return task;
  },

  async updateTaskStatus(projectId, taskId, status) {
    await delay(50);
    store.updateTaskStatus(projectId, taskId, status);
    capture('task_status_updated', { project_id: projectId, task_id: taskId, status });
  },

  async deleteTask(projectId, taskId) {
    await delay(50);
    store.deleteTask(projectId, taskId);
    capture('task_deleted', { project_id: projectId, task_id: taskId });
  },

  async assignTask(projectId, taskId, assigneeId) {
    await delay(50);
    store.assignTask(projectId, taskId, assigneeId);
    capture('task_assignee_updated', {
      project_id: projectId,
      task_id: taskId,
      assignee_id: assigneeId,
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
    capture('settings_updated', { updated_settings: Object.keys(updates).sort() });
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
