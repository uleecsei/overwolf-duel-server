document.getElementById('form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

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
        const response = await fetch('/auth/login', {
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
            const result = await response.json();
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

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

document.getElementById('register-link1').addEventListener('click', registerLinkCallback);
document.getElementById('register-link2').addEventListener('click', registerLinkCallback);

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

document.getElementById('login-link').addEventListener('click', registerLinkCallback);
