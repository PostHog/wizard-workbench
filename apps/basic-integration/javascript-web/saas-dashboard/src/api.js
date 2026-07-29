/**
 * Simulated async API layer.
 *
 * Wraps store operations in Promises with artificial delay
 * to mimic real network calls. In a real app, these would be
 * fetch() calls to a backend.
 */
import { store } from './store.js';
import { isPostHogConfigured, posthog } from './posthog.js';

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
    if (isPostHogConfigured) {
      if (previousUser && previousUser.id !== user.id) posthog.reset();
      posthog.identify(user.id, {
        email: user.email,
        name: user.name,
        role: user.role,
      });
      posthog.capture('user_logged_in', {
        role: user.role,
      });
    }

    return user;
  },

  async logout() {
    await delay(50);
    if (isPostHogConfigured) {
      posthog.capture('user_logged_out');
      posthog.reset();
    }
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
    if (isPostHogConfigured) {
      posthog.capture('project_created', {
        project_status: project.status,
        has_description: Boolean(project.description),
      });
    }
    return project;
  },

  async deleteProject(id) {
    await delay();
    const project = store.getProject(id);
    store.deleteProject(id);
    if (isPostHogConfigured && project) {
      posthog.capture('project_deleted', {
        project_status: project.status,
        task_count: project.tasks.length,
      });
    }
  },

  async addTask(projectId, title, priority) {
    await delay();

    if (!title.trim()) throw new Error('Task title is required');
    const task = store.addTask(projectId, title.trim(), priority);
    if (isPostHogConfigured && task) {
      posthog.capture('task_created', {
        priority: task.priority,
        status: task.status,
      });
    }
    return task;
  },

  async updateTaskStatus(projectId, taskId, status) {
    await delay(50);
    const task = store.getProject(projectId)?.tasks.find((item) => item.id === taskId);
    const previousStatus = task?.status;
    store.updateTaskStatus(projectId, taskId, status);
    if (isPostHogConfigured && task && previousStatus !== status) {
      posthog.capture(status === 'done' ? 'task_completed' : 'task_status_changed', {
        previous_status: previousStatus,
        status,
        priority: task.priority,
      });
    }
  },

  async deleteTask(projectId, taskId) {
    await delay(50);
    const task = store.getProject(projectId)?.tasks.find((item) => item.id === taskId);
    store.deleteTask(projectId, taskId);
    if (isPostHogConfigured && task) {
      posthog.capture('task_deleted', {
        status: task.status,
        priority: task.priority,
        was_assigned: Boolean(task.assignee),
      });
    }
  },

  async assignTask(projectId, taskId, assigneeId) {
    await delay(50);
    const task = store.getProject(projectId)?.tasks.find((item) => item.id === taskId);
    const wasAssigned = Boolean(task?.assignee);
    store.assignTask(projectId, taskId, assigneeId);
    if (isPostHogConfigured && task) {
      posthog.capture('task_assigned', {
        was_assigned: wasAssigned,
        is_assigned: Boolean(assigneeId),
        status: task.status,
      });
    }
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
    if (isPostHogConfigured) {
      posthog.capture('settings_updated', {
        setting_names: Object.keys(updates),
      });
    }
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
