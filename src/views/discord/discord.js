async function getUser() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/auth/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            const data = await response.json();
            if (data?.user?.discordId && data?.user?.discordData) {
                window.location.href = '/profile';
            }
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData.message);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

getUser();
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