// Login page JavaScript
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
let posthog = null;

document.addEventListener('DOMContentLoaded', async () => {
    await initializePostHog();
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    errorMessage.style.display = 'none';

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            if (posthog && data.user) {
                posthog.identify(data.user.id, {
                    email,
                    username: data.user.username,
                });
            }
            window.location.href = '/';
        } else {
            errorMessage.textContent = data.error || 'Login failed';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        errorMessage.textContent = 'Connection error. Please try again.';
        errorMessage.style.display = 'block';
    }
});

// Allow any password for demo
document.getElementById('password').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loginForm.dispatchEvent(new Event('submit'));
    }
});

async function initializePostHog() {
    try {
        const response = await fetch('/api/posthog/config');
        const config = await response.json();

        if (!config.token || !config.host || !window.posthog) {
            return;
        }

        window.posthog.init(config.token, {
            api_host: config.host,
            person_profiles: 'identified_only',
        });
        posthog = window.posthog;
    } catch (error) {
        posthog = null;
    }
}
