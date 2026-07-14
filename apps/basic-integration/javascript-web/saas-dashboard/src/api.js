/**
 * Simulated async API layer.
 *
 * Wraps store operations in Promises with artificial delay
 * to mimic real network calls. In a real app, these would be
 * fetch() calls to a backend.
 */
import { store } from './store.js';
import { captureException } from './posthog.js';

const DELAY_MS = 150;

function delay(ms = DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const api = {
  async login(email) {
    await delay();

    const success = store.login(email);
    if (!success) {
      const error = new Error('Invalid credentials. Use a team member email.');
      captureException(error, {
        area: 'auth',
        action: 'login',
      });
      throw error;
    }
    return store.state.currentUser;
  },

  async logout() {
    await delay(50);
    store.logout();
  },

  async getProjects() {
    await delay();
    return store.state.projects;
  },

  async getProject(id) {
    await delay();
    const project = store.getProject(id);
    if (!project) {
      const error = new Error(`Project ${id} not found`);
      captureException(error, {
        area: 'projects',
        action: 'get_project',
        project_id: id,
      });
      throw error;
    }
    return project;
  },

  async createProject(name, description) {
    await delay();

    if (!name.trim()) {
      const error = new Error('Project name is required');
      captureException(error, {
        area: 'projects',
        action: 'create_project',
      });
      throw error;
    }
    return store.createProject(name.trim(), description.trim());
  },

  async deleteProject(id) {
    await delay();
    store.deleteProject(id);
  },

  async addTask(projectId, title, priority) {
    await delay();

    if (!title.trim()) {
      const error = new Error('Task title is required');
      captureException(error, {
        area: 'tasks',
        action: 'add_task',
        project_id: projectId,
      });
      throw error;
    }
    return store.addTask(projectId, title.trim(), priority);
  },

  async updateTaskStatus(projectId, taskId, status) {
    await delay(50);
    store.updateTaskStatus(projectId, taskId, status);
  },

  async deleteTask(projectId, taskId) {
    await delay(50);
    store.deleteTask(projectId, taskId);
  },

  async assignTask(projectId, taskId, assigneeId) {
    await delay(50);
    store.assignTask(projectId, taskId, assigneeId);
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
