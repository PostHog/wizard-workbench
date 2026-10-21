/**
 * Simulated async API layer.
 *
 * Wraps store operations in Promises with artificial delay
 * to mimic real network calls. In a real app, these would be
 * fetch() calls to a backend.
 */
import posthog, { isPostHogConfigured } from './posthog.js';
import { appLogger } from './posthog-logger.js';
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
    if (isPostHogConfigured && user?.id) {
      posthog.identify(user.id, {
        email: user.email,
        name: user.name,
        role: user.role,
      });
      posthog.capture('user_signed_in');
    }

    return user;
  },

  async logout() {
    await delay(50);
    if (isPostHogConfigured) {
      posthog.capture('user_signed_out');
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
      posthog.capture('project_created');
    }
    appLogger.info('project creation completed', { event: 'project.created' });
    return project;
  },

  async deleteProject(id) {
    await delay();
    store.deleteProject(id);
    if (isPostHogConfigured) {
      posthog.capture('project_deleted');
    }
  },

  async addTask(projectId, title, priority) {
    await delay();

    if (!title.trim()) throw new Error('Task title is required');
    const task = store.addTask(projectId, title.trim(), priority);
    if (task && isPostHogConfigured) {
      posthog.capture('task_created', { priority });
    }
    if (task) {
      appLogger.info('task creation completed', {
        event: 'task.created',
        priority,
      });
    }
    return task;
  },

  async updateTaskStatus(projectId, taskId, status) {
    await delay(50);
    store.updateTaskStatus(projectId, taskId, status);
    if (isPostHogConfigured) {
      posthog.capture('task_status_changed', { status });
    }
    appLogger.info('task status update completed', {
      event: 'task.status_updated',
      status,
    });
  },

  async deleteTask(projectId, taskId) {
    await delay(50);
    store.deleteTask(projectId, taskId);
    if (isPostHogConfigured) {
      posthog.capture('task_deleted');
    }
  },

  async assignTask(projectId, taskId, assigneeId) {
    await delay(50);
    store.assignTask(projectId, taskId, assigneeId);
    if (isPostHogConfigured) {
      posthog.capture('task_assignee_changed', {
        assignment: assigneeId ? 'assigned' : 'unassigned',
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
      posthog.capture('preference_updated', {
        preference: Object.keys(updates)[0],
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
