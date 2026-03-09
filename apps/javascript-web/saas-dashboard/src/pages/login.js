import { api } from '../api.js';
import { router } from '../router.js';
import { posthog } from '../posthog.js';

export function renderLogin() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="login-page">
      <div class="login-card">
        <h1>TrackFlow</h1>
        <p class="login-subtitle">Project management for fast-moving teams</p>
        <form id="login-form">
          <label for="email">Email</label>
          <input type="email" id="email" placeholder="alice@trackflow.dev" required />
          <button type="submit">Sign In</button>
          <p id="login-error" class="error" hidden></p>
        </form>
        <div class="login-hint">
          <p>Demo accounts:</p>
          <ul>
            <li>alice@trackflow.dev (Admin)</li>
            <li>bob@trackflow.dev</li>
            <li>carol@trackflow.dev</li>
          </ul>
        </div>
      </div>
    </div>
  `;

  const form = document.getElementById('login-form');
  const errorEl = document.getElementById('login-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.hidden = true;

    const email = document.getElementById('email').value.trim();
    const btn = form.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'Signing in...';

    try {
      const user = await api.login(email);
      posthog.identify(user.id, {
        name: user.name,
        email: user.email,
        role: user.role,
      });
      posthog.capture('user_signed_in', { role: user.role });
      router.navigate('/dashboard');
    } catch (err) {
      if (err.message === 'Invalid credentials. Use a team member email.') {
        posthog.capture('login_failed');
      } else {
        posthog.captureException(err, { context: 'login' });
      }
      errorEl.textContent = err.message;
      errorEl.hidden = false;
      btn.disabled = false;
      btn.textContent = 'Sign In';
    }
  });
}
