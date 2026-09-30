/**
 * Simulated async API layer.
 *
 * Wraps store operations in Promises with artificial delay
 * to mimic real network calls. In a real app, these would be
 * fetch() calls to a backend.
 */
import { logPostHogOperation } from './posthog-logger.js';
import { identifyUser, isPostHogConfigured, posthog, resetPostHog } from './posthog.js';
import { store } from './store.js';

const DELAY_MS = 150;

function captureEvent(event, properties) {
  if (isPostHogConfigured) posthog.capture(event, properties);
}

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
    if (previousUser && previousUser.id !== user.id) resetPostHog();
    identifyUser(user);
    captureEvent('user_logged_in');
    logPostHogOperation('user login completed', {
      operation: 'user_login',
      authentication_method: 'demo_credentials',
    });
    return user;
  },

  async logout() {
    await delay(50);
    captureEvent('user_logged_out');
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
    captureEvent('project_created', {
      has_description: hasDescription,
      initial_status: project.status,
    });
    logPostHogOperation('project creation completed', {
      operation: 'project_create',
      has_description: hasDescription,
      initial_status: project.status,
    });
    return project;
  },

  async deleteProject(id) {
    await delay();
    store.deleteProject(id);
    captureEvent('project_deleted');
  },

  async addTask(projectId, title, priority) {
    await delay();

    if (!title.trim()) throw new Error('Task title is required');
    const task = store.addTask(projectId, title.trim(), priority);
    if (task) {
      captureEvent('task_created', {
        initial_status: task.status,
        priority: task.priority,
      });
    }
    return task;
  },

  async updateTaskStatus(projectId, taskId, status) {
    await delay(50);
    store.updateTaskStatus(projectId, taskId, status);
    captureEvent('task_status_updated', { status });
    logPostHogOperation('task status update completed', {
      operation: 'task_status_update',
      status,
    });
  },

  async deleteTask(projectId, taskId) {
    await delay(50);
    store.deleteTask(projectId, taskId);
    captureEvent('task_deleted');
  },

  async assignTask(projectId, taskId, assigneeId) {
    await delay(50);
    store.assignTask(projectId, taskId, assigneeId);
    captureEvent('task_assignee_updated', {
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
    if ('theme' in updates) {
      captureEvent('setting_updated', { setting: 'theme', value: updates.theme });
    }
    if ('emailNotifications' in updates) {
      captureEvent('setting_updated', {
        setting: 'email_notifications',
        enabled: updates.emailNotifications,
      });
    }
    if ('weeklyDigest' in updates) {
      captureEvent('setting_updated', {
        setting: 'weekly_digest',
        enabled: updates.weeklyDigest,
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
