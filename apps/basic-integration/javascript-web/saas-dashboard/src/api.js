/**
 * Simulated async API layer.
 *
 * Wraps store operations in Promises with artificial delay
 * to mimic real network calls. In a real app, these would be
 * fetch() calls to a backend.
 */
import { posthog } from './posthog.js';
import { store } from './store.js';

const DELAY_MS = 150;
const projectWorkflowLogger = posthog?.logger;

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
    if (previousUser && previousUser.id !== user.id) {
      posthog?.reset();
    }
    posthog?.identify(user.id, {
      email: user.email,
      name: user.name,
      role: user.role,
    });
    posthog?.capture('logged_in', { login_method: 'email' });

    return user;
  },

  async logout() {
    await delay(50);
    posthog?.capture('logged_out');
    posthog?.reset();
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
    posthog?.capture('created_project', { project_id: project.id });
    projectWorkflowLogger?.info('project created', {
      event: 'project.created',
      project_id: project.id,
      status: project.status,
    });
    return project;
  },

  async deleteProject(id) {
    await delay();
    store.deleteProject(id);
    posthog?.capture('deleted_project', { project_id: id });
  },

  async addTask(projectId, title, priority) {
    await delay();

    if (!title.trim()) throw new Error('Task title is required');
    const task = store.addTask(projectId, title.trim(), priority);
    if (task) {
      posthog?.capture('added_task', {
        project_id: projectId,
        task_id: task.id,
        priority,
      });
    }
    return task;
  },

  async updateTaskStatus(projectId, taskId, status) {
    await delay(50);
    const previousStatus = store.getProject(projectId)?.tasks.find((task) => task.id === taskId)?.status;
    store.updateTaskStatus(projectId, taskId, status);
    posthog?.capture(status === 'done' ? 'completed_task' : 'moved_task', {
      project_id: projectId,
      task_id: taskId,
      previous_status: previousStatus,
      status,
    });
    projectWorkflowLogger?.info('task status updated', {
      event: 'task.status_updated',
      project_id: projectId,
      task_id: taskId,
      previous_status: previousStatus,
      status,
    });
  },

  async deleteTask(projectId, taskId) {
    await delay(50);
    store.deleteTask(projectId, taskId);
    posthog?.capture('deleted_task', { project_id: projectId, task_id: taskId });
  },

  async assignTask(projectId, taskId, assigneeId) {
    await delay(50);
    store.assignTask(projectId, taskId, assigneeId);
    posthog?.capture('assigned_task', {
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
    posthog?.capture('settings_updated', { updated_settings: Object.keys(updates) });
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
