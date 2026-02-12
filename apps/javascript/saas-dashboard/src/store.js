/**
 * Application state backed by localStorage.
 *
 * Provides a reactive-ish store: call store.save() after mutations
 * and re-render your current view.
 */

const STORAGE_KEY = 'trackflow_data';

const DEFAULT_STATE = {
  currentUser: null,
  projects: [
    {
      id: 'proj_1',
      name: 'Marketing Website',
      description: 'Redesign the company marketing site',
      status: 'active',
      createdAt: '2025-12-01T10:00:00Z',
      tasks: [
        { id: 't1', title: 'Design homepage mockup', status: 'done', priority: 'high', assignee: 'alice', createdAt: '2025-12-01T10:00:00Z' },
        { id: 't2', title: 'Implement responsive nav', status: 'done', priority: 'medium', assignee: 'bob', createdAt: '2025-12-02T09:00:00Z' },
        { id: 't3', title: 'Write landing page copy', status: 'in_progress', priority: 'high', assignee: 'carol', createdAt: '2025-12-03T14:00:00Z' },
        { id: 't4', title: 'Set up analytics tracking', status: 'todo', priority: 'medium', assignee: null, createdAt: '2025-12-04T11:00:00Z' },
        { id: 't5', title: 'Performance audit', status: 'todo', priority: 'low', assignee: null, createdAt: '2025-12-05T08:00:00Z' },
      ],
    },
    {
      id: 'proj_2',
      name: 'Mobile App v2',
      description: 'Major feature update for the mobile application',
      status: 'active',
      createdAt: '2025-11-15T09:00:00Z',
      tasks: [
        { id: 't6', title: 'Push notification system', status: 'in_progress', priority: 'high', assignee: 'alice', createdAt: '2025-11-15T09:00:00Z' },
        { id: 't7', title: 'Offline mode support', status: 'todo', priority: 'high', assignee: 'bob', createdAt: '2025-11-16T10:00:00Z' },
        { id: 't8', title: 'Dark mode theme', status: 'done', priority: 'medium', assignee: 'carol', createdAt: '2025-11-17T13:00:00Z' },
        { id: 't9', title: 'App store screenshots', status: 'todo', priority: 'low', assignee: null, createdAt: '2025-11-20T16:00:00Z' },
      ],
    },
    {
      id: 'proj_3',
      name: 'API Migration',
      description: 'Migrate REST API to GraphQL',
      status: 'archived',
      createdAt: '2025-10-01T08:00:00Z',
      tasks: [
        { id: 't10', title: 'Schema design', status: 'done', priority: 'high', assignee: 'bob', createdAt: '2025-10-01T08:00:00Z' },
        { id: 't11', title: 'Resolver implementation', status: 'done', priority: 'high', assignee: 'alice', createdAt: '2025-10-05T09:00:00Z' },
        { id: 't12', title: 'Client migration', status: 'done', priority: 'medium', assignee: 'carol', createdAt: '2025-10-15T11:00:00Z' },
      ],
    },
  ],
  teamMembers: [
    { id: 'alice', name: 'Alice Chen', email: 'alice@trackflow.dev', role: 'admin', avatar: 'AC' },
    { id: 'bob', name: 'Bob Martinez', email: 'bob@trackflow.dev', role: 'member', avatar: 'BM' },
    { id: 'carol', name: 'Carol Kim', email: 'carol@trackflow.dev', role: 'member', avatar: 'CK' },
  ],
  settings: {
    theme: 'light',
    emailNotifications: true,
    weeklyDigest: true,
  },
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : structuredClone(DEFAULT_STATE);
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

let state = load();

export const store = {
  get state() {
    return state;
  },

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },

  reset() {
    state = structuredClone(DEFAULT_STATE);
    this.save();
  },

  // --- Auth ---

  login(email) {
    const member = state.teamMembers.find((m) => m.email === email);
    if (!member) return false;
    state.currentUser = member;
    this.save();
    return true;
  },

  logout() {
    state.currentUser = null;
    this.save();
  },

  // --- Projects ---

  getProject(id) {
    return state.projects.find((p) => p.id === id);
  },

  createProject(name, description) {
    const project = {
      id: `proj_${Date.now()}`,
      name,
      description,
      status: 'active',
      createdAt: new Date().toISOString(),
      tasks: [],
    };
    state.projects.push(project);
    this.save();
    return project;
  },

  deleteProject(id) {
    state.projects = state.projects.filter((p) => p.id !== id);
    this.save();
  },

  // --- Tasks ---

  addTask(projectId, title, priority = 'medium') {
    const project = this.getProject(projectId);
    if (!project) return null;

    const task = {
      id: `t_${Date.now()}`,
      title,
      status: 'todo',
      priority,
      assignee: null,
      createdAt: new Date().toISOString(),
    };
    project.tasks.push(task);
    this.save();
    return task;
  },

  updateTaskStatus(projectId, taskId, status) {
    const project = this.getProject(projectId);
    if (!project) return;

    const task = project.tasks.find((t) => t.id === taskId);
    if (task) {
      task.status = status;
      this.save();
    }
  },

  deleteTask(projectId, taskId) {
    const project = this.getProject(projectId);
    if (!project) return;

    project.tasks = project.tasks.filter((t) => t.id !== taskId);
    this.save();
  },

  assignTask(projectId, taskId, assigneeId) {
    const project = this.getProject(projectId);
    if (!project) return;

    const task = project.tasks.find((t) => t.id === taskId);
    if (task) {
      task.assignee = assigneeId;
      this.save();
    }
  },

  // --- Settings ---

  updateSettings(updates) {
    Object.assign(state.settings, updates);
    this.save();
  },

  // --- Stats ---

  getStats() {
    const activeProjects = state.projects.filter((p) => p.status === 'active');
    const allTasks = state.projects.flatMap((p) => p.tasks);
    const doneTasks = allTasks.filter((t) => t.status === 'done');
    const inProgressTasks = allTasks.filter((t) => t.status === 'in_progress');
    const todoTasks = allTasks.filter((t) => t.status === 'todo');

    return {
      totalProjects: state.projects.length,
      activeProjects: activeProjects.length,
      totalTasks: allTasks.length,
      doneTasks: doneTasks.length,
      inProgressTasks: inProgressTasks.length,
      todoTasks: todoTasks.length,
      completionRate: allTasks.length > 0
        ? Math.round((doneTasks.length / allTasks.length) * 100)
        : 0,
      tasksByPriority: {
        high: allTasks.filter((t) => t.priority === 'high').length,
        medium: allTasks.filter((t) => t.priority === 'medium').length,
        low: allTasks.filter((t) => t.priority === 'low').length,
      },
      tasksByMember: state.teamMembers.map((m) => ({
        name: m.name,
        count: allTasks.filter((t) => t.assignee === m.id).length,
      })),
    };
  },
};
