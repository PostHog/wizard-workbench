import { api } from '../api.js';
import { router } from '../router.js';
import { store } from '../store.js';
import posthog from '../posthog.js';

/**
 * Renders the app shell: sidebar + header + content area.
 * Highlights the active nav item based on `activeSection`.
 */
export function renderShell(activeSection) {
  const app = document.getElementById('app');
  const user = store.state.currentUser;

  app.innerHTML = `
    <div class="app-layout">
      <aside class="sidebar">
        <div class="sidebar-brand">
          <h1>TrackFlow</h1>
        </div>
        <nav class="sidebar-nav">
          <a href="#/dashboard" class="nav-item ${activeSection === 'dashboard' ? 'active' : ''}">
            <span class="nav-icon">&#x25A3;</span>
            Dashboard
          </a>
          <a href="#/projects" class="nav-item ${activeSection === 'projects' ? 'active' : ''}">
            <span class="nav-icon">&#x2630;</span>
            Projects
          </a>
          <a href="#/activity" class="nav-item ${activeSection === 'activity' ? 'active' : ''}">
            <span class="nav-icon">&#x23F1;</span>
            Activity
          </a>
          <a href="#/settings" class="nav-item ${activeSection === 'settings' ? 'active' : ''}">
            <span class="nav-icon">&#x2699;</span>
            Settings
          </a>
        </nav>
      </aside>

      <div class="main-area">
        <header class="topbar">
          <div class="topbar-left">
            <span class="greeting">Welcome, ${user?.name?.split(' ')[0] || 'User'}</span>
          </div>
          <div class="topbar-right">
            <span class="avatar topbar-avatar">${user?.avatar || '??'}</span>
            <button id="logout-btn" class="btn-text">Sign Out</button>
          </div>
        </header>

        <main id="content" class="content"></main>
      </div>
    </div>
  `;

  document.getElementById('logout-btn').addEventListener('click', async () => {
    posthog.capture('user logged out');
    await api.logout();
    posthog.reset();
    router.navigate('/login');
  });
}
