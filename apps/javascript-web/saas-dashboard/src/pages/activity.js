import { api } from '../api.js';
import { store } from '../store.js';
import { renderShell } from '../components/shell.js';

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

export async function renderActivity() {
  renderShell('activity');

  const content = document.getElementById('content');
  content.innerHTML = '<div class="loading">Loading activity...</div>';

  try {
    const activities = await api.getActivities();

    content.innerHTML = `
      <div class="page-header">
        <h2>Activity Log</h2>
      </div>

      <div class="activity-list">
        ${activities.length === 0
          ? '<p class="text-muted" style="text-align:center;padding:2rem;">No activity yet.</p>'
          : activities
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
      </div>
    `;
  } catch (err) {
    content.innerHTML = `<div class="error-message">Failed to load activity: ${err.message}</div>`;
  }
}
