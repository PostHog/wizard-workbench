import { api } from '../api.js';
import { renderShell } from '../components/shell.js';

export async function renderDashboard() {
  renderShell('dashboard');

  const content = document.getElementById('content');
  content.innerHTML = '<div class="loading">Loading dashboard...</div>';

  try {
    const stats = await api.getStats();
    const projects = await api.getProjects();
    const activeProjects = projects.filter((p) => p.status === 'active');

    content.innerHTML = `
      <div class="page-header">
        <h2>Dashboard</h2>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-value">${stats.activeProjects}</span>
          <span class="stat-label">Active Projects</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${stats.totalTasks}</span>
          <span class="stat-label">Total Tasks</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${stats.completionRate}%</span>
          <span class="stat-label">Completion Rate</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${stats.inProgressTasks}</span>
          <span class="stat-label">In Progress</span>
        </div>
      </div>

      <div class="dashboard-columns">
        <div class="dashboard-section">
          <h3>Task Breakdown</h3>
          <div class="progress-bars">
            <div class="progress-row">
              <span class="progress-label">Done</span>
              <div class="progress-track">
                <div class="progress-fill done" style="width: ${stats.totalTasks ? (stats.doneTasks / stats.totalTasks) * 100 : 0}%"></div>
              </div>
              <span class="progress-count">${stats.doneTasks}</span>
            </div>
            <div class="progress-row">
              <span class="progress-label">In Progress</span>
              <div class="progress-track">
                <div class="progress-fill in-progress" style="width: ${stats.totalTasks ? (stats.inProgressTasks / stats.totalTasks) * 100 : 0}%"></div>
              </div>
              <span class="progress-count">${stats.inProgressTasks}</span>
            </div>
            <div class="progress-row">
              <span class="progress-label">To Do</span>
              <div class="progress-track">
                <div class="progress-fill todo" style="width: ${stats.totalTasks ? (stats.todoTasks / stats.totalTasks) * 100 : 0}%"></div>
              </div>
              <span class="progress-count">${stats.todoTasks}</span>
            </div>
          </div>
        </div>

        <div class="dashboard-section">
          <h3>Team Workload</h3>
          <div class="team-list">
            ${stats.tasksByMember
              .map(
                (m) => `
              <div class="team-row">
                <span class="team-name">${m.name}</span>
                <span class="team-count">${m.count} task${m.count !== 1 ? 's' : ''}</span>
              </div>
            `,
              )
              .join('')}
          </div>
        </div>
      </div>

      <div class="dashboard-section">
        <h3>Active Projects</h3>
        <div class="project-cards">
          ${activeProjects
            .map(
              (p) => `
            <a href="#/projects/${p.id}" class="project-card-link">
              <div class="project-card">
                <h4>${p.name}</h4>
                <p>${p.description}</p>
                <div class="project-card-meta">
                  <span>${p.tasks.length} tasks</span>
                  <span>${p.tasks.filter((t) => t.status === 'done').length} done</span>
                </div>
              </div>
            </a>
          `,
            )
            .join('')}
        </div>
      </div>
    `;
  } catch (err) {
    content.innerHTML = `<div class="error-message">Failed to load dashboard: ${err.message}</div>`;
  }
}
