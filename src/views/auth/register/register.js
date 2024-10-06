document.getElementById('form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    // Convert form data to JSON
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const callbackUrl = urlParams.get('callbackUrl');
        if (callbackUrl) {
            data.callbackUrl = callbackUrl;
        }
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.status === 200) {
            const responseData = await response.json();
            if (responseData.redirectUrl) {
                location.href = responseData.redirectUrl;
            } else {
                localStorage.setItem('token', responseData.token);
                location.href = '/discord-page';
            }
        } else {
            response.json().then(data => alert(data.message));
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

function loginLinkCallback(event) {
    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const callbackUrl = urlParams.get('callbackUrl');
    if (callbackUrl) {
        window.location.href = `/login?callbackUrl=${callbackUrl}`;
    } else {
        window.location.href = '/login';
    }

}

document.getElementById('login-link').addEventListener('click', loginLinkCallback);

function registerLinkCallback(event) {
    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const callbackUrl = urlParams.get('callbackUrl');
    if (callbackUrl) {
        window.location.href = `/register?callbackUrl=${callbackUrl}`;
    } else {
        window.location.href = '/register';
    }

}

document.getElementById('register-link').addEventListener('click', registerLinkCallback);