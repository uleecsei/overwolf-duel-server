const url = 'http://localhost:3000';
const loginButton = document.getElementById('discord-button');
const loader = document.getElementById('loader');

loginButton?.addEventListener('click', () => {
    login();
    loginButton.style.display = 'none';
    loader.style.display = 'block';
});

async function login() {
    try {
        const response = await fetch(url + '/auth/discord/login', {
            method: 'GET',
        });

        response.json().then((data) => {
            localStorage.setItem('sessionId', data.sessionId);
            window.location.replace(data.url);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}
