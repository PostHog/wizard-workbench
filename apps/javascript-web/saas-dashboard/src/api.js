/**
 * Simulated async API layer.
 *
 * Wraps store operations in Promises with artificial delay
 * to mimic real network calls. In a real app, these would be
 * fetch() calls to a backend.
 */
import { store } from './store.js';
import posthog from './posthog.js';

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
    posthog.identify(user.id, { email: user.email, name: user.name, role: user.role });
    return user;
  },

  async logout() {
    await delay(50);
    store.logout();
    posthog.reset();
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
    posthog.capture('project_created', { project_id: project.id, project_name: project.name });
    return project;
  },

  async deleteProject(id) {
    await delay();
    const project = store.getProject(id);
    store.deleteProject(id);
    posthog.capture('project_deleted', { project_id: id, project_name: project?.name });
  },

  async addTask(projectId, title, priority) {
    await delay();

    if (!title.trim()) throw new Error('Task title is required');
    const task = store.addTask(projectId, title.trim(), priority);
    posthog.capture('task_added', { project_id: projectId, task_id: task.id, task_title: task.title, priority });
    return task;
  },

  async updateTaskStatus(projectId, taskId, status) {
    await delay(50);
    store.updateTaskStatus(projectId, taskId, status);
    posthog.capture('task_status_changed', { project_id: projectId, task_id: taskId, status });
  },

  async deleteTask(projectId, taskId) {
    await delay(50);
    store.deleteTask(projectId, taskId);
    posthog.capture('task_deleted', { project_id: projectId, task_id: taskId });
  },

  async assignTask(projectId, taskId, assigneeId) {
    await delay(50);
    store.assignTask(projectId, taskId, assigneeId);
    posthog.capture('task_assigned', { project_id: projectId, task_id: taskId, assignee_id: assigneeId });
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
    posthog.capture('settings_updated', updates);
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
