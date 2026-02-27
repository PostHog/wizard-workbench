// Login page JavaScript
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

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
