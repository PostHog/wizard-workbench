/**
 * Simulated async API layer.
 *
 * Wraps store operations in Promises with artificial delay
 * to mimic real network calls. In a real app, these would be
 * fetch() calls to a backend.
 */
import { capturePostHog, identifyUser, posthogLog, resetPostHog } from './posthog.js';
import { store } from './store.js';

const DELAY_MS = 150;

function delay(ms = DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const api = {
  async login(email) {
    await delay();

    const success = store.login(email);
    if (!success) {
      throw new Error('Invalid credentials. Use a team member email.');
    }
    const user = store.state.currentUser;
    identifyUser(user);
    capturePostHog('logged_in');
    posthogLog.info('User login completed');
    return user;
  },

  async logout() {
    await delay(50);
    capturePostHog('logged_out');
    resetPostHog();
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
    capturePostHog('created_project', { has_description: hasDescription });
    posthogLog.info('Project creation completed', { has_description: hasDescription });
    return project;
  },

  async deleteProject(id) {
    await delay();
    store.deleteProject(id);
    capturePostHog('deleted_project');
  },

  async addTask(projectId, title, priority) {
    await delay();

    if (!title.trim()) throw new Error('Task title is required');
    const task = store.addTask(projectId, title.trim(), priority);
    if (task) {
      capturePostHog('added_task', { priority });
      posthogLog.info('Task creation completed', { priority });
    }
    return task;
  },

  async updateTaskStatus(projectId, taskId, status) {
    await delay(50);
    store.updateTaskStatus(projectId, taskId, status);
    capturePostHog(status === 'done' ? 'completed_task' : 'moved_task', { status });
  },

  async deleteTask(projectId, taskId) {
    await delay(50);
    store.deleteTask(projectId, taskId);
    capturePostHog('deleted_task');
  },

  async assignTask(projectId, taskId, assigneeId) {
    await delay(50);
    store.assignTask(projectId, taskId, assigneeId);
    capturePostHog('assigned_task', {
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
    capturePostHog('settings_updated', { updated_settings: Object.keys(updates) });
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
