document.getElementById('discord').addEventListener('click', async function(event) {
    event.preventDefault();
    try {
        const response = await fetch('/auth/discord/login', {
            method: 'GET',
        });

        response.json().then((data) => {
            window.location.replace(data.url);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
});