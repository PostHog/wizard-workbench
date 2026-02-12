import { Chart, DoughnutController, ArcElement, Tooltip, Legend, BarController, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { api } from '../api.js';
import { store } from '../store.js';
import { renderShell } from '../components/shell.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend, BarController, BarElement, CategoryScale, LinearScale);

const ACTION_META = {
  created_project: { icon: '&#x2795;', label: 'Created project', color: 'var(--color-primary)' },
  deleted_project: { icon: '&#x2716;', label: 'Deleted project', color: 'var(--color-danger)' },
  added_task: { icon: '&#x2795;', label: 'Added task', color: 'var(--color-success)' },
  completed_task: { icon: '&#x2714;', label: 'Completed task', color: 'var(--color-success)' },
  moved_task: { icon: '&#x27A1;', label: 'Moved task', color: 'var(--color-warning)' },
  deleted_task: { icon: '&#x2716;', label: 'Deleted task', color: 'var(--color-danger)' },
  assigned_task: { icon: '&#x1F464;', label: 'Assigned task', color: 'var(--color-primary)' },
  logged_in: { icon: '&#x2192;', label: 'Signed in', color: 'var(--color-text-muted)' },
};

function formatTime(ts) {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getMemberName(userId) {
  const member = store.state.teamMembers.find((m) => m.id === userId);
  return member?.name || userId;
}

function isDark() {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

export async function renderDashboard() {
  renderShell('dashboard');

  const content = document.getElementById('content');
  content.innerHTML = '<div class="loading">Loading dashboard...</div>';

  try {
    const [stats, projects, activities] = await Promise.all([
      api.getStats(),
      api.getProjects(),
      api.getActivities(),
    ]);
    const activeProjects = projects.filter((p) => p.status === 'active');
    const recentActivities = activities.slice(0, 5);

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
          <div class="chart-container">
            <canvas id="task-chart"></canvas>
          </div>
        </div>

        <div class="dashboard-section">
          <h3>Team Workload</h3>
          <div class="chart-container">
            <canvas id="team-chart"></canvas>
          </div>
        </div>
      </div>

      <div class="dashboard-columns">
        <div class="dashboard-section">
          <div class="section-header-row">
            <h3>Recent Activity</h3>
            <a href="#/activity" class="view-all-link">View all &#x2192;</a>
          </div>
          ${recentActivities.length === 0
            ? '<p class="text-muted" style="padding:0.5rem 0;">No activity yet.</p>'
            : `<div class="activity-list compact">
                ${recentActivities
                  .map((a) => {
                    const meta = ACTION_META[a.action] || { icon: '&#x25CB;', label: a.action, color: 'var(--color-text-muted)' };
                    return `
                      <div class="activity-item">
                        <div class="activity-icon" style="color:${meta.color}">${meta.icon}</div>
                        <div class="activity-body">
                          <span class="activity-user">${getMemberName(a.user)}</span>
                          <span class="activity-action">${meta.label.toLowerCase()}</span>
                          <span class="activity-detail">${a.detail}</span>
                        </div>
                        <span class="activity-time">${formatTime(a.timestamp)}</span>
                      </div>
                    `;
                  })
                  .join('')}
              </div>`}
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
      </div>
    `;

    // --- Render Charts ---

    const dark = isDark();
    const textColor = dark ? '#e5e7eb' : '#1a1a2e';
    const gridColor = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

    // Doughnut — Task Breakdown
    new Chart(document.getElementById('task-chart'), {
      type: 'doughnut',
      data: {
        labels: ['Done', 'In Progress', 'To Do'],
        datasets: [
          {
            data: [stats.doneTasks, stats.inProgressTasks, stats.todoTasks],
            backgroundColor: ['#22c55e', '#f59e0b', '#94a3b8'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: textColor, padding: 16, usePointStyle: true, pointStyleWidth: 8 },
          },
        },
      },
    });

    // Bar — Team Workload
    new Chart(document.getElementById('team-chart'), {
      type: 'bar',
      data: {
        labels: stats.tasksByMember.map((m) => m.name.split(' ')[0]),
        datasets: [
          {
            label: 'Tasks',
            data: stats.tasksByMember.map((m) => m.count),
            backgroundColor: '#4f46e5',
            borderRadius: 4,
            barThickness: 32,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1, color: textColor },
            grid: { color: gridColor },
          },
          x: {
            ticks: { color: textColor },
            grid: { display: false },
          },
        },
      },
    });
  } catch (err) {
    content.innerHTML = `<div class="error-message">Failed to load dashboard: ${err.message}</div>`;
  }
}
