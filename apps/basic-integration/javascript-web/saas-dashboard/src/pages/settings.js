import { api } from '../api.js';
import { isPostHogConfigured, posthog } from '../posthog.js';
import { store } from '../store.js';
import { renderShell } from '../components/shell.js';

export async function renderSettings() {
  renderShell('settings');

  const content = document.getElementById('content');
  content.innerHTML = '<div class="loading">Loading settings...</div>';

  try {
    const settings = await api.getSettings();
    const user = store.state.currentUser;

    content.innerHTML = `
      <div class="page-header">
        <h2>Settings</h2>
      </div>

      <div class="settings-sections">
        <section class="settings-section">
          <h3>Profile</h3>
          <div class="settings-row">
            <label>Name</label>
            <span>${user.name}</span>
          </div>
          <div class="settings-row">
            <label>Email</label>
            <span>${user.email}</span>
          </div>
          <div class="settings-row">
            <label>Role</label>
            <span class="badge badge-${user.role}">${user.role}</span>
          </div>
        </section>

        <section class="settings-section">
          <h3>Preferences</h3>
          <div class="settings-row">
            <label for="theme-select">Theme</label>
            <select id="theme-select">
              <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Light</option>
              <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
            </select>
          </div>
          <div class="settings-row">
            <label for="email-notif">Email Notifications</label>
            <input type="checkbox" id="email-notif" ${settings.emailNotifications ? 'checked' : ''} />
          </div>
          <div class="settings-row">
            <label for="weekly-digest">Weekly Digest</label>
            <input type="checkbox" id="weekly-digest" ${settings.weeklyDigest ? 'checked' : ''} />
          </div>
        </section>

        <section class="settings-section">
          <h3>Team Members</h3>
          <div class="team-members-list">
            ${store.state.teamMembers
              .map(
                (m) => `
              <div class="team-member-row">
                <span class="avatar">${m.avatar}</span>
                <div class="team-member-info">
                  <strong>${m.name}</strong>
                  <small>${m.email}</small>
                </div>
                <span class="badge badge-${m.role}">${m.role}</span>
              </div>
            `,
              )
              .join('')}
          </div>
        </section>

        <section class="settings-section">
          <h3>Danger Zone</h3>
          <button id="reset-data-btn" class="btn-danger">Reset All Data</button>
        </section>
      </div>
    `;

    // Theme
    document.getElementById('theme-select').addEventListener('change', async (e) => {
      await api.updateSettings({ theme: e.target.value });
      document.body.dataset.theme = e.target.value;
    });

    // Notifications
    document.getElementById('email-notif').addEventListener('change', async (e) => {
      await api.updateSettings({ emailNotifications: e.target.checked });
    });

    document.getElementById('weekly-digest').addEventListener('change', async (e) => {
      await api.updateSettings({ weeklyDigest: e.target.checked });
    });

    // Reset
    document.getElementById('reset-data-btn').addEventListener('click', () => {
      if (confirm('Reset all data to defaults? This cannot be undone.')) {
        if (isPostHogConfigured) posthog.capture('data_reset');
        store.reset();
        store.login(user.email);
        renderSettings();
      }
    });
  } catch (err) {
    content.innerHTML = `<div class="error-message">Failed to load settings: ${err.message}</div>`;
  }
}
