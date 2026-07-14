// Login page JavaScript
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const distinctIdInput = document.getElementById('distinctId');
const sessionIdInput = document.getElementById('sessionId');

function getOrCreateBrowserId() {
    const storageKey = 'ph_distinct_id';
    let distinctId = localStorage.getItem(storageKey);

    if (!distinctId) {
        distinctId = `web_${crypto.randomUUID()}`;
        localStorage.setItem(storageKey, distinctId);
    }

    return distinctId;
}

function getOrCreateSessionId() {
    const storageKey = 'ph_session_id';
    let sessionId = sessionStorage.getItem(storageKey);

    if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem(storageKey, sessionId);
    }

    return sessionId;
}

function captureEvent(eventName, properties = {}) {
    const payload = {
        api_key: window.POSTHOG_CONFIG.projectApiKey,
        event: eventName,
        distinct_id: getOrCreateBrowserId(),
        properties: {
            ...properties,
            $current_url: window.location.href,
            $host: window.location.host,
            session_id: getOrCreateSessionId(),
        },
    };

    navigator.sendBeacon(
        `${window.POSTHOG_CONFIG.host}/capture/`,
        JSON.stringify(payload)
    );
}

function initializeTracking() {
    distinctIdInput.value = getOrCreateBrowserId();
    sessionIdInput.value = getOrCreateSessionId();
}

initializeTracking();

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    errorMessage.style.display = 'none';

    captureEvent('login_submitted', {
        login_method: 'email',
        has_password: Boolean(password),
    });

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-POSTHOG-DISTINCT-ID': distinctIdInput.value,
                'X-POSTHOG-SESSION-ID': sessionIdInput.value,
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('ph_distinct_id', data.user.id);
            captureEvent('user_logged_in', {
                login_method: 'email',
                authentication_result: 'success',
            });
            window.location.href = '/';
        } else {
            captureEvent('user_login_failed', {
                login_method: 'email',
                failure_reason: data.error || 'login_failed',
            });
            errorMessage.textContent = data.error || 'Login failed';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        captureEvent('user_login_failed', {
            login_method: 'email',
            failure_reason: 'network_error',
        });
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
