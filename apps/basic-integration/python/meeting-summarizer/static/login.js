// Login page JavaScript
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const posthogDistinctIdField = document.getElementById('posthogDistinctId');

async function initializePostHog() {
    if (!window.__POSTHOG_CONFIG__?.apiKey || !window.__POSTHOG_CONFIG__?.host || window.posthog?.__loaded) {
        return;
    }

    const script = document.createElement('script');
    script.src = `${window.__POSTHOG_CONFIG__.host}/static/array.js`;
    script.async = true;

    await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });

    window.posthog.init(window.__POSTHOG_CONFIG__.apiKey, {
        api_host: window.__POSTHOG_CONFIG__.host,
        person_profiles: 'identified_only'
    });
    window.posthog.__loaded = true;
}

function getAnonymousDistinctId() {
    const storageKey = 'posthog_distinct_id';
    let distinctId = window.localStorage.getItem(storageKey);

    if (!distinctId) {
        distinctId = `anon_${crypto.randomUUID()}`;
        window.localStorage.setItem(storageKey, distinctId);
    }

    return distinctId;
}

posthogDistinctIdField.value = getAnonymousDistinctId();

initializePostHog().catch(() => {
    // Continue without client-side analytics if the script cannot load.
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const anonymousDistinctId = getAnonymousDistinctId();

    errorMessage.style.display = 'none';

    if (window.posthog) {
        window.posthog.capture('user_login_submitted', {
            has_password: Boolean(password),
            is_demo_login: email.trim().toLowerCase() === 'demo@meetingsummarizer.ai'
        });
    }

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-POSTHOG-DISTINCT-ID': anonymousDistinctId,
            },
            body: JSON.stringify({ email, password, posthog_distinct_id: anonymousDistinctId }),
        });

        const data = await response.json();

        if (response.ok) {
            if (window.posthog && data.user?.id) {
                window.posthog.identify(data.user.id, {
                    email,
                    username: data.user.username
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
