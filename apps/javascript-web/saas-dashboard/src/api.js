/**
 * Simulated async API layer.
 *
 * Wraps store operations in Promises with artificial delay
 * to mimic real network calls. In a real app, these would be
 * fetch() calls to a backend.
 */
import { store } from './store.js';
import { posthog } from './posthog.js';

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
    if (!project) throw new Error(`Project ${id} not found`);
    return project;
  },

  async createProject(name, description) {
    await delay();

    if (!name.trim()) throw new Error('Project name is required');
    const project = store.createProject(name.trim(), description.trim());
    const user = store.state.currentUser;
    posthog.capture({
      distinctId: user?.id || 'anonymous',
      event: 'project created',
      properties: {
        project_id: project.id,
        project_name: project.name,
      },
    });
    return project;
  },

  async deleteProject(id) {
    await delay();
    const project = store.getProject(id);
    store.deleteProject(id);
    const user = store.state.currentUser;
    posthog.capture({
      distinctId: user?.id || 'anonymous',
      event: 'project deleted',
      properties: {
        project_id: id,
        project_name: project?.name,
      },
    });
  },

  async addTask(projectId, title, priority) {
    await delay();

    if (!title.trim()) throw new Error('Task title is required');
    const task = store.addTask(projectId, title.trim(), priority);
    const user = store.state.currentUser;
    posthog.capture({
      distinctId: user?.id || 'anonymous',
      event: 'task added',
      properties: {
        project_id: projectId,
        task_id: task?.id,
        task_title: title.trim(),
        priority,
      },
    });
    return task;
  },

  async updateTaskStatus(projectId, taskId, status) {
    await delay(50);
    store.updateTaskStatus(projectId, taskId, status);
    const user = store.state.currentUser;
    posthog.capture({
      distinctId: user?.id || 'anonymous',
      event: 'task status updated',
      properties: {
        project_id: projectId,
        task_id: taskId,
        new_status: status,
      },
    });
  },

  async deleteTask(projectId, taskId) {
    await delay(50);
    const project = store.getProject(projectId);
    const task = project?.tasks.find((t) => t.id === taskId);
    store.deleteTask(projectId, taskId);
    const user = store.state.currentUser;
    posthog.capture({
      distinctId: user?.id || 'anonymous',
      event: 'task deleted',
      properties: {
        project_id: projectId,
        task_id: taskId,
        task_title: task?.title,
      },
    });
  },

  async assignTask(projectId, taskId, assigneeId) {
    await delay(50);
    store.assignTask(projectId, taskId, assigneeId);
    const user = store.state.currentUser;
    posthog.capture({
      distinctId: user?.id || 'anonymous',
      event: 'task assigned',
      properties: {
        project_id: projectId,
        task_id: taskId,
        assignee_id: assigneeId || null,
      },
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
    const user = store.state.currentUser;
    posthog.capture({
      distinctId: user?.id || 'anonymous',
      event: 'settings updated',
      properties: {
        ...updates,
      },
    });
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
