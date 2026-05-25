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
    const user = store.state.currentUser;
    await delay(50);
    store.logout();
    if (user) {
      posthog.capture({ distinctId: user.email, event: 'user signed out' });
    }
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
      distinctId: user?.email ?? 'anonymous',
      event: 'project created',
      properties: {
        project_id: project.id,
        project_name: project.name,
        has_description: !!description.trim(),
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
      distinctId: user?.email ?? 'anonymous',
      event: 'project deleted',
      properties: {
        project_id: id,
        project_name: project?.name,
        task_count: project?.tasks?.length ?? 0,
      },
    });
  },

  async addTask(projectId, title, priority) {
    await delay();

    if (!title.trim()) throw new Error('Task title is required');
    const task = store.addTask(projectId, title.trim(), priority);
    const user = store.state.currentUser;
    const project = store.getProject(projectId);
    posthog.capture({
      distinctId: user?.email ?? 'anonymous',
      event: 'task added',
      properties: {
        task_id: task?.id,
        task_priority: priority,
        project_id: projectId,
        project_name: project?.name,
      },
    });
    return task;
  },

  async updateTaskStatus(projectId, taskId, status) {
    await delay(50);
    const project = store.getProject(projectId);
    const task = project?.tasks?.find((t) => t.id === taskId);
    store.updateTaskStatus(projectId, taskId, status);
    const user = store.state.currentUser;
    const eventName = status === 'done' ? 'task completed' : 'task status updated';
    posthog.capture({
      distinctId: user?.email ?? 'anonymous',
      event: eventName,
      properties: {
        task_id: taskId,
        task_title: task?.title,
        task_priority: task?.priority,
        new_status: status,
        project_id: projectId,
        project_name: project?.name,
      },
    });
  },

  async deleteTask(projectId, taskId) {
    await delay(50);
    const project = store.getProject(projectId);
    const task = project?.tasks?.find((t) => t.id === taskId);
    store.deleteTask(projectId, taskId);
    const user = store.state.currentUser;
    posthog.capture({
      distinctId: user?.email ?? 'anonymous',
      event: 'task deleted',
      properties: {
        task_id: taskId,
        task_priority: task?.priority,
        task_status: task?.status,
        project_id: projectId,
        project_name: project?.name,
      },
    });
  },

  async assignTask(projectId, taskId, assigneeId) {
    await delay(50);
    const project = store.getProject(projectId);
    const task = project?.tasks?.find((t) => t.id === taskId);
    store.assignTask(projectId, taskId, assigneeId);
    const user = store.state.currentUser;
    posthog.capture({
      distinctId: user?.email ?? 'anonymous',
      event: 'task assigned',
      properties: {
        task_id: taskId,
        task_title: task?.title,
        assignee_id: assigneeId ?? null,
        is_unassigned: !assigneeId,
        project_id: projectId,
        project_name: project?.name,
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
      distinctId: user?.email ?? 'anonymous',
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
