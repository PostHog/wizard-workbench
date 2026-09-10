/**
 * Simulated async API layer.
 *
 * Wraps store operations in Promises with artificial delay
 * to mimic real network calls. In a real app, these would be
 * fetch() calls to a backend.
 */
import { capturePostHog, identifyUser, resetPostHog } from './posthog.js';
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

    const user = store.state.currentUser;
    if (previousUser?.id && previousUser.id !== user.id) {
      resetPostHog();
    }
    identifyUser(user);
    capturePostHog('user_logged_in', {
      role: user.role,
      is_account_switch: Boolean(previousUser?.id && previousUser.id !== user.id),
    });
    return user;
  },

  async logout() {
    await delay(50);
    capturePostHog('user_logged_out');
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
    capturePostHog('project_created', {
      project_id: project.id,
      has_description: Boolean(project.description),
    });
    return project;
  },

  async deleteProject(id) {
    await delay();
    store.deleteProject(id);
    capturePostHog('project_deleted', { project_id: id });
  },

  async addTask(projectId, title, priority) {
    await delay();

    if (!title.trim()) throw new Error('Task title is required');
    const task = store.addTask(projectId, title.trim(), priority);
    if (task) {
      capturePostHog('task_created', {
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
    capturePostHog('task_status_changed', {
      project_id: projectId,
      task_id: taskId,
      status,
    });
  },

  async deleteTask(projectId, taskId) {
    await delay(50);
    store.deleteTask(projectId, taskId);
    capturePostHog('task_deleted', {
      project_id: projectId,
      task_id: taskId,
    });
  },

  async assignTask(projectId, taskId, assigneeId) {
    await delay(50);
    store.assignTask(projectId, taskId, assigneeId);
    capturePostHog('task_assignee_changed', {
      project_id: projectId,
      task_id: taskId,
      is_assigned: Boolean(assigneeId),
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
    capturePostHog('settings_updated', { changed_settings: Object.keys(updates) });
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
