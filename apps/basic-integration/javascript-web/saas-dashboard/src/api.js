/**
 * Simulated async API layer.
 *
 * Wraps store operations in Promises with artificial delay
 * to mimic real network calls. In a real app, these would be
 * fetch() calls to a backend.
 */
import { store } from './store.js';
import { captureEvent, identifyUser, logApplicationOperation, resetUser } from './posthog.js';

const DELAY_MS = 150;

function delay(ms = DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const api = {
  async login(email) {
    const previousUserId = store.state.currentUser?.id;
    await delay();

    const success = store.login(email);
    if (!success) {
      throw new Error('Invalid credentials. Use a team member email.');
    }

    if (previousUserId && previousUserId !== store.state.currentUser.id) {
      resetUser();
    }

    identifyUser(store.state.currentUser);
    captureEvent('user_logged_in');
    logApplicationOperation('authentication completed', { outcome: 'success' });
    return store.state.currentUser;
  },

  async logout() {
    await delay(50);
    captureEvent('user_logged_out');
    resetUser();
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
    captureEvent('project_created', {
      project_id: project.id,
      has_description: Boolean(project.description),
    });
    logApplicationOperation('project created', {
      project_id: project.id,
      has_description: Boolean(project.description),
    });
    return project;
  },

  async deleteProject(id) {
    await delay();
    store.deleteProject(id);
    captureEvent('project_deleted', { project_id: id });
  },

  async addTask(projectId, title, priority) {
    await delay();

    if (!title.trim()) throw new Error('Task title is required');
    const task = store.addTask(projectId, title.trim(), priority);
    if (task) {
      captureEvent('task_created', {
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
    captureEvent('task_status_changed', {
      project_id: projectId,
      task_id: taskId,
      status,
    });
    logApplicationOperation('task status updated', {
      project_id: projectId,
      task_id: taskId,
      status,
    });
  },

  async deleteTask(projectId, taskId) {
    await delay(50);
    store.deleteTask(projectId, taskId);
    captureEvent('task_deleted', { project_id: projectId, task_id: taskId });
  },

  async assignTask(projectId, taskId, assigneeId) {
    await delay(50);
    store.assignTask(projectId, taskId, assigneeId);
    captureEvent('task_assignment_changed', {
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
