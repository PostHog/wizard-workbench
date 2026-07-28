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

function delay(ms = DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function identifyUser(user) {
  posthog.identify(user.id, {
    email: user.email,
    name: user.name,
    role: user.role,
  });
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
      posthog.reset();
    }
    identifyUser(user);
    posthog.capture('user_logged_in', {
      role: user.role,
    });
    return user;
  },

  async logout() {
    await delay(50);
    posthog.capture('user_logged_out');
    posthog.reset();
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
    posthog.capture('project_created', {
      project_id: project.id,
      has_description: Boolean(project.description),
    });
    return project;
  },

  async deleteProject(id) {
    await delay();
    const project = store.getProject(id);
    store.deleteProject(id);
    if (project) {
      posthog.capture('project_deleted', {
        project_id: id,
        task_count: project.tasks.length,
      });
    }
  },

  async addTask(projectId, title, priority) {
    await delay();

    if (!title.trim()) throw new Error('Task title is required');
    const task = store.addTask(projectId, title.trim(), priority);
    if (task) {
      posthog.capture('task_created', {
        project_id: projectId,
        task_id: task.id,
        priority: task.priority,
      });
    }
    return task;
  },

  async updateTaskStatus(projectId, taskId, status) {
    await delay(50);
    const task = store.getProject(projectId)?.tasks.find((item) => item.id === taskId);
    const previous_status = task?.status;
    store.updateTaskStatus(projectId, taskId, status);
    if (task && previous_status !== status) {
      posthog.capture('task_status_updated', {
        project_id: projectId,
        task_id: taskId,
        previous_status,
        status,
      });
    }
  },

  async deleteTask(projectId, taskId) {
    await delay(50);
    const task = store.getProject(projectId)?.tasks.find((item) => item.id === taskId);
    store.deleteTask(projectId, taskId);
    if (task) {
      posthog.capture('task_deleted', {
        project_id: projectId,
        task_id: taskId,
        status: task.status,
        priority: task.priority,
      });
    }
  },

  async assignTask(projectId, taskId, assigneeId) {
    await delay(50);
    const task = store.getProject(projectId)?.tasks.find((item) => item.id === taskId);
    const previous_assignee_id = task?.assignee || null;
    store.assignTask(projectId, taskId, assigneeId);
    if (task && previous_assignee_id !== assigneeId) {
      posthog.capture('task_assignee_updated', {
        project_id: projectId,
        task_id: taskId,
        previous_assignee_id,
        assignee_id: assigneeId,
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
    posthog.capture('settings_updated', {
      changed_settings: Object.keys(updates),
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
